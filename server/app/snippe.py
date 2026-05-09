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
    from snippe import (
        AuthenticationError,
        ForbiddenError,
        RateLimitError,
        ServerError,
        SnippeError,
        UnprocessableEntityError,
        ValidationError,
        WebhookVerificationError,
    )
    from snippe.models import Customer
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
    ) -> None:
        self.api_key = api_key or os.getenv('SNIPPE_API_KEY')
        self.webhook_url = webhook_url or os.getenv('SNIPPE_WEBHOOK_URL')
        self.http_client = httpx.Client(timeout=30.0)

        if not self.api_key:
            logger.warning('SNIPPE_API_KEY is missing; using stub mode.')
            self.api_key = 'test'

        if SDK_AVAILABLE:
            self.client = Snippe(self.api_key)
            logger.info('Snippe SDK initialised (v%s)', getattr(Snippe, '__version__', '?'))
        else:
            self.client = None
            logger.warning('Snippe SDK not installed; using stub mode.')

    def verify_webhook(self, payload: bytes, signature: str, timestamp: str, secret: str) -> bool:
        if SDK_AVAILABLE:
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
            except Exception as exc:
                logger.error('Webhook verification error: %s', exc)
                return False
        return False

    def create_link(
        self,
        *,
        amount: int,
        currency: str,
        phone_number: str,
        student_name: str,
        parent_email: str,
        callback_url: str,
        metadata: Dict[str, Any],
    ) -> Dict[str, Any]:
        if self.client is not None:
            parts = student_name.strip().split(' ', 1)
            customer = Customer(
                firstname=parts[0],
                lastname=parts[1] if len(parts) > 1 else parts[0],
                email=parent_email,
            )

            # Errors that should never be retried — they will not resolve on their own
            _no_retry = (AuthenticationError, ForbiddenError, ValidationError, UnprocessableEntityError)

            for attempt in range(1, 4):
                try:
                    payment = self.client.create_mobile_payment(
                        amount=amount,
                        currency=currency,
                        phone_number=phone_number,
                        customer=customer,
                        callback_url=callback_url,
                        webhook_url=self.webhook_url,
                        metadata=metadata,
                    )
                    return {
                        'reference': payment.reference,
                        'payment_link_url': payment.payment_url,
                        'status': payment.status,
                    }
                except _no_retry as exc:
                    # Client-side error: fail immediately with the actual message
                    raise SnippeClientError(str(exc)) from exc
                except (ServerError, RateLimitError, Exception) as exc:
                    logger.error('Snippe attempt %d/%d failed (%s): %s', attempt, 3, type(exc).__name__, exc)
                    if attempt == 3:
                        raise SnippeClientError(f'Snippe unavailable after 3 attempts: {exc}') from exc
                    time.sleep(2 ** attempt)

        # Stub mode: mobile USSD has no payment URL
        reference_id = str(uuid.uuid4())
        logger.info('Stub mode: generated mobile payment reference=%s', reference_id)
        return {
            'reference': reference_id,
            'payment_link_url': None,
            'status': PaymentStatus.pending,
            'metadata': metadata,
        }
