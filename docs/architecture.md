Architecture

High-level components:

- FastAPI backend — exposes endpoints to create payment links and receive webhooks.
- Snippe SDK / API — used to create payment links and to verify signatures on webhooks.
- Data store — minimal persistence for payment requests and statuses (prototype: SQLite).

Flow:

1. School UI or admin service calls `POST /payments/create-link` with student info and amount.
2. FastAPI handler creates a local payment record (pending) and calls Snippe SDK to create a payment link containing metadata (student name, amount, internal payment id).
3. FastAPI returns the payment link to the caller. The parent opens the link and pays via Snippe-hosted checkout.
4. Snippe sends webhook events (`payment.completed`, `payment.failed`, etc.) to `POST /webhooks/snippe`.
5. Backend verifies the webhook signature, updates local payment status, and triggers optional notifications.

Security notes:
- Store `SNIPPE_API_KEY` securely in env; do not commit keys.
- The frontend should not have access to Snippe API keys.
- Use `SNIPPE_API_KEY` to create payment links from the backend.
- Use `SNIPPE_WEBHOOK_SECRET` and `X-Webhook-Signature` to verify payment confirmations.
- Webhooks are the primary payment confirmation mechanism.
- Verify webhook signatures according to Snippe docs before updating records.
