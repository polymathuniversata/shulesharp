from __future__ import annotations

import os
import time
import uuid
import logging
from typing import Any, Dict

import httpx
from .schemas import PaymentStatus

try:
    from snippe import Snippe, verify_webhook
    from snippe import WebhookVerificationError
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False

logger = logging.getLogger(__name__)


class SnippeClientError(Exception):
    pass


class SnippeClient:
    def __init__(
        self,
        api_key: str | None = None,
        webhook_url: str | None = None,
        redirect_url: str | None = None,
    ) -> None:
        self.api_key = api_key or os.getenv('SNIPPE_API_KEY')
        self.webhook_url = webhook_url or os.getenv('SNIPPE_WEBHOOK_URL')
        self.redirect_url = redirect_url or os.getenv('SNIPPE_REDIRECT_URL')
        self.http_client = httpx.Client(timeout=30.0)

        if not self.api_key:
            logger.warning('SNIPPE_API_KEY is missing; using local stub mode.')
            self.api_key = 'test'

        if SDK_AVAILABLE:
            self.client = Snippe(self.api_key)
        else:
            self.client = None

    def _call_sdk_method(self, method_name: str, **kwargs: Any) -> Dict[str, Any]:
        method = getattr(self.client, method_name, None)
        if method is None:
            raise SnippeClientError(f'Snippe SDK method {method_name} is not available.')

        for attempt in range(1, 4):
            try:
                response = method(**kwargs)
                if hasattr(response, 'dict'):
                    return response.dict()
                if isinstance(response, dict):
                    return response
                return {k: getattr(response, k) for k in ('reference', 'checkout_url', 'payment_link_url', 'short_code') if hasattr(response, k)}
            except TypeError as exc:
                raise SnippeClientError(f'Snippe SDK failed to create payment link: {exc}') from exc
            except Exception as exc:
                if attempt == 3:
                    raise SnippeClientError(f'Snippe SDK request failed after retries: {exc}') from exc
                time.sleep(2 ** attempt)

    def verify_webhook(self, payload: bytes, signature: str, timestamp: str, secret: str) -> bool:
        if SDK_AVAILABLE and self.client is not None:
            try:
                verify_webhook(
                    body=payload.decode('utf-8'),
                    signature=signature,
                    timestamp=timestamp,
                    signing_key=secret,
                )
                return True
            except WebhookVerificationError:
                return False
            except Exception:
                return False
        return False

    def create_link(self, *, amount: int, currency: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        if self.client is not None:
            if hasattr(self.client, 'create_payment_link'):
                return self._call_sdk_method(
                    'create_payment_link',
                    amount=amount,
                    currency=currency,
                    metadata=metadata,
                    webhook_url=self.webhook_url,
                    redirect_url=self.redirect_url,
                )

            if hasattr(self.client, 'create_session'):
                return self._call_sdk_method(
                    'create_session',
                    amount=amount,
                    currency=currency,
                    metadata=metadata,
                    webhook_url=self.webhook_url,
                    redirect_url=self.redirect_url,
                )

            logger.warning('Snippe SDK installed but does not support direct link creation; falling back to stub.')

        reference_id = str(uuid.uuid4())
        return {
            'reference_id': reference_id,
            'url': f'https://snippe.sh/pay/{reference_id}',
            'status': PaymentStatus.pending,
            'metadata': metadata,
        }
