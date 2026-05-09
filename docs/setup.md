Setup & Quickstart

Prerequisites:
- Python 3.10+
- `pip` and virtualenv (or use `venv`)

1. Create virtualenv and install requirements

```bash
python -m venv .venv
source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
python -m pip install -r requirements.txt
```

2. Environment

Create a `.env` (or set env vars) with:

- `SNIPPE_API_KEY` — your Snippe API key, used only by the backend to create payment links
- `SNIPPE_WEBHOOK_SECRET` — webhook signing secret for verifying event payloads
- `SNIPPE_WEBHOOK_URL` — public webhook URL for Snippe events, e.g. `https://yourapp.com/webhooks/snippe`
- `DATABASE_URL` — optional, e.g. `sqlite:///./payments.db`
- `SNIPPE_REDIRECT_URL` — optional redirect URL after payment completion

This project loads `.env` automatically on startup using `python-dotenv`.

This project loads `.env` automatically on startup using `python-dotenv`.

3. Run the app

```bash
python -m uvicorn app.main:app --reload --port 8000
```

4. Run tests

Install dependencies and run the test suite with:

```bash
python -m pip install -r requirements.txt
python -m pytest -q
```

5. Test endpoints

Use `curl` or Postman to hit `POST /payments/create-link` (see API docs).

6. Local webhook testing

```bash
python -m uvicorn app.main:app --reload --port 8000
ngrok http 8000
```

- Register the generated HTTPS ngrok URL in Snippe as your webhook URL.
- Example webhook endpoint:
  `https://abc123.ngrok.io/webhooks/snippe`
- Use `http://127.0.0.1:4040` to inspect webhook requests from Snippe.

> If Git Bash does not find `ngrok` after installation, close and reopen the terminal so the updated PATH is loaded. In Git Bash, the install path is typically `/c/Users/<username>/AppData/Local/Programs/ngrok`.

7. Run tests

Install dependencies and run the test suite with:

```bash
python -m pip install -r requirements.txt
python -m pytest -q
```
