Snippe Integration

This doc summarizes how to integrate the Snippe Python SDK and create payment links. Refer to the official docs for exact SDK method names and webhook formats:

- SDKs (Python): https://docs.snippe.sh/docs/2026-01-25/sdks/python
- Payments overview: https://docs.snippe.sh/docs/2026-01-25/payments

The backend now includes an SDK-enabled `SnippeClient` wrapper that will use the installed `snippe` package when available and fall back to a local test stub otherwise.

This solution uses both the Snippe API key and webhook confirmation together:
- `SNIPPE_API_KEY` is used on the backend to create payment links.
- `SNIPPE_WEBHOOK_SECRET` is used to verify Snippe webhook events for payment confirmation.
- The frontend receives only the payment link and status updates, never the API key.

Example setup:

```bash
python -m pip install -r requirements.txt
```

Example Python usage:

```python
from snippe import Snippe
import os

client = Snippe(os.getenv('SNIPPE_API_KEY'))
```

This backend attempts to call either `create_payment_link` or `create_session` from the installed SDK. If your Snippe SDK version supports a different method name, update `app/snippe.py` accordingly.

Recommendations:
- Embed your local `payment_id` in Snippe `metadata` so you can correlate webhook events to local records.
- Set `SNIPPE_REDIRECT_URL` so customers return to your site after checkout.
- Configure `SNIPPE_WEBHOOK_URL` so Snippe delivers events to the backend.
- Use idempotency keys if the SDK supports them to avoid duplicate links on retries.

Useful docs:
- Webhooks: https://docs.snippe.sh/docs/2026-01-25/webhooks
- Error handling: https://docs.snippe.sh/docs/2026-01-25/error-handling
