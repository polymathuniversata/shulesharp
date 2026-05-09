# shulesharp

A FastAPI backend for a school payments module using Snippe payment links and webhook-driven confirmation.

## How it works

- The backend uses `SNIPPE_API_KEY` to create payment links with Snippe.
- The frontend receives the generated payment link and shares it with parents.
- Snippe calls the backend webhook at `/webhooks/snippe` when payment events occur.
- The backend verifies the webhook using `SNIPPE_WEBHOOK_SECRET` and updates payment status.

## Quickstart

1. Copy `.env.example` to `.env` and set real values.
2. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Install `ngrok` and restart your terminal if necessary so Git Bash can see it.
4. Run the service:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
5. Run tests:
   ```bash
   python -m pytest -q
   ```

## Docs

See `docs/setup.md`, `docs/api.md`, and `docs/webhooks.md` for integration details.

A FastAPI backend for a school payments module using Snippe payment links and webhook-driven confirmation.

## Key features

- Create Snippe payment links from student payment requests
- Store payment records in SQLite
- Confirm payment status via Snippe webhooks
- Backend-only API key handling; frontend does not receive Snippe credentials
- Health check endpoint: `GET /health`

## Quickstart

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Run the service:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
4. Run tests:
   ```bash
   python -m pytest -q
   ```

## Docs

See `docs/setup.md`, `docs/api.md`, and `docs/webhooks.md` for integration details.
