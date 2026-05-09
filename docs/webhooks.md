Webhooks

Purpose: Receive and process webhook events from Snippe (payment.completed, payment.failed, payment.voided, payment.expired, etc.).

Endpoint:

- POST /webhooks/snippe

Security & verification:

- Snippe sends signature headers on every webhook.
- Required headers:
  - `X-Webhook-Signature` — HMAC-SHA256 signature of `{timestamp}.{payload}`
  - `X-Webhook-Timestamp` — Unix timestamp included in the signed message
- Verify the signature using your `SNIPPE_WEBHOOK_SECRET` and reject events older than 5 minutes.
- This backend uses `hmac.compare_digest` for a constant-time comparison.
- Use `SNIPPE_API_KEY` to create the payment link and `SNIPPE_WEBHOOK_SECRET` to verify completion.
- Snippe docs: https://docs.snippe.sh/docs/2026-01-25/webhooks

Example FastAPI handler (concept):

```python
from fastapi import Request, HTTPException

@app.post('/webhooks/snippe')
async def snippe_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get('Snippe-Signature')
    if not verify_snippe_signature(payload, signature, secret=WEBHOOK_SECRET):
        raise HTTPException(status_code=400, detail='Invalid signature')
    event = request.json()
    # process event.type, update local payment record using metadata.payment_id
    return {'ok': True}

```

Event handling tips:
- `payment.created` — optional to log/confirm link created
- `payment.succeeded` — mark local payment as `succeeded` and notify school system
- `payment.failed` — mark as `failed` and optionally retry or notify parent

Testing locally:
- Use `ngrok` to expose local webhook endpoint and register URL in Snippe dashboard for testing.

Local test steps:

```bash
# Start your FastAPI app locally
python -m uvicorn app.main:app --reload --port 8000

# In another terminal, start ngrok
ngrok http 8000
```

- Copy the generated HTTPS URL, e.g. `https://abc123.ngrok.io`
- Set Snippe webhook target to:
  `https://abc123.ngrok.io/webhooks/snippe`
- Use the local webhook URL in `SNIPPE_WEBHOOK_URL` if you want the backend to include it in requests or logs.

If you need to inspect incoming requests, open the ngrok web UI at `http://127.0.0.1:4040`.
