API — Endpoints

Endpoints (FastAPI)

1) Create payment link

- POST /payments/create-link
- Body (JSON):

```json
{
  "student_name": "Jane Doe",
  "student_id": "S-12345",
  "amount": 5000,
  "currency": "NGN",
  "parent_email": "parent@example.com",
  "description": "Term fees - Term 2"
}
```

- Response (201):

```json
{
  "payment_id": "local-uuid",
  "snippe_link": "https://snippe.sh/pay/xyz",
  "status": "pending"
}
```

Notes: The backend should create a local payment record and call Snippe to create a payment link, embedding `payment_id` in the metadata. The frontend never receives or stores the Snippe API key; it only consumes the returned payment link.

2) Get payment status

- GET /payments/{payment_id}
- Response: local payment record (status, amount, student info, snippe reference id)

3) Webhook receiver

- POST /webhooks/snippe
- Accepts webhook events from Snippe; verify signature and update local records.
- Required headers:
  - `X-Webhook-Signature` — HMAC-SHA256 signature header
  - `X-Webhook-Timestamp` — Unix timestamp used to verify the signature

4) Health check

- GET /health
- Response: `{'status': 'ok', 'database': 'connected'}`

Pydantic schemas (examples):

- `CreateLinkRequest` — student_name: str, student_id: str, amount: int, currency: str, parent_email: Optional[str], description: Optional[str]
- `CreateLinkResponse` — payment_id: str, snippe_link: str, status: str

Implementation notes:
- Keep the API minimal for hackathon scope; validate amounts > 0 and student info present.
- Use UUIDs or incremental ids for `payment_id`.
