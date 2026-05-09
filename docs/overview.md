Overview

Project: Simple School Payment module (hackathon)

Goal: Provide a small FastAPI backend that generates unique Snippe payment links (a "snippe link") for each student payment request so parents can pay quickly. The link contains student details and amount, and Snippe handles payment processing.

Key ideas:
- Students and payments: create a payment request containing student name, class/ID, amount, and optional description.
- Generate a unique, short Snippe link per payment request and return it to the caller (school UI or API consumer).
- The backend uses `SNIPPE_API_KEY` server-side to create payment links; the frontend never stores API keys.
- Receive Snippe webhooks to update payment status (succeeded, failed, refunded, etc.).
- Use API key + webhook together: API key for link creation, webhook for payment confirmation.
- Keep the service minimal and secure for hackathon delivery.

Tech stack:
- Backend: FastAPI
- Payment provider: Snippe (Python SDK + webhooks)
- Persistence: lightweight (SQLite or in-memory for prototype)
- Deploy/run: uvicorn for local testing
