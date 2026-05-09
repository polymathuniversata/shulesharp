# EduPay Bursar — Architecture

## What it does

EduPay Bursar is a school fee management system. School administrators (bursars) generate payment links for individual students. Those links are shared with parents. When a parent opens their link and clicks "Pay", a USSD push is sent to their mobile phone via the Snippe payment gateway. The parent approves the prompt on their phone and the payment is recorded automatically via a webhook.

There are two distinct user surfaces:
- **The admin portal** — used by the bursar to generate links, track payments, and see a dashboard overview.
- **The payment page** (`/pay`) — a public-facing page parents open to initiate and confirm their payment.

---

## Folder structure

```
webhook-weekend/
├── frontend/          React + Vite SPA (bursar portal + parent payment page)
│   ├── src/
│   │   ├── pages/     One file per route
│   │   ├── components/  Sidebar, TopBar
│   │   ├── layouts/   DashboardLayout (wraps all admin routes)
│   │   ├── lib/
│   │   │   └── api.js   All HTTP calls to the backend
│   │   ├── App.jsx    Route definitions
│   │   └── main.jsx   Entry point
│   ├── public/        Static assets (favicon, icon sprite)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/            FastAPI backend
│   ├── app/
│   │   ├── main.py    All routes + startup
│   │   ├── schemas.py Pydantic request/response models
│   │   ├── store.py   SQLite persistence layer
│   │   └── snippe.py  Snippe SDK wrapper + stub mode
│   ├── tests/
│   │   └── test_payments.py
│   └── requirements.txt
│
├── .env               Shared environment variables (root, both services read this)
├── docs/              Extended documentation
└── architecture.md    This file
```

---

## Frontend

### Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI |
| Vite | 8 | Dev server + bundler |
| Tailwind CSS | 4 | Styling (via `@tailwindcss/vite` plugin) |
| React Router | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Material Symbols | (CDN) | Icon font |

### Routing

Defined in `src/App.jsx`. There are two layout zones:

```
/               → redirects to /dashboard
/dashboard      ┐
/students       │  wrapped in DashboardLayout (sidebar + topbar)
/fee-structures │
/payment-links  │
/payments       │
/reports        │
/settings       ┘

/pay            standalone page — no sidebar, public-facing
```

`DashboardLayout` (`src/layouts/DashboardLayout.jsx`) renders the fixed `Sidebar` on the left, the fixed `TopBar` at the top, and the current page via `<Outlet />` in the main content area.

### Pages

| File | Route | Purpose |
|------|-------|---------|
| `Dashboard.jsx` | `/dashboard` | KPI cards + recent payment table, all data fetched live |
| `PaymentLinks.jsx` | `/payment-links` | Generate links form + active link tracking table |
| `PaymentsTracker.jsx` | `/payments` | Full payment history with status badges |
| `PayStudentFees.jsx` | `/pay?payment_id=` | Parent-facing payment page |
| `Students.jsx` | `/students` | Placeholder |
| `FeeStructures.jsx` | `/fee-structures` | Placeholder |
| `Reports.jsx` | `/reports` | Placeholder |
| `Settings.jsx` | `/settings` | Placeholder |

### API layer

All backend calls go through `src/lib/api.js`. It creates a single Axios instance pointed at `VITE_API_URL` (defaults to `http://localhost:8000`) and exports named functions:

```js
createPaymentLink(data)      // POST /payments/create-link
getPayment(id)               // GET  /payments/:id
listPayments(limit)          // GET  /payments
initiatePayment(id)          // POST /payments/:id/initiate
```

No component calls `fetch` or `axios` directly — everything goes through this module.

---

## Backend

### Stack

| Tool | Version | Purpose |
|------|---------|---------|
| FastAPI | 0.115 | HTTP framework |
| Uvicorn | 0.24 | ASGI server |
| Pydantic v2 | (via FastAPI) | Request/response validation |
| SQLite | stdlib | Database |
| python-dotenv | 1.0 | `.env` loading |
| snippe | ≥0.1 | Snippe payment SDK |
| httpx | 0.24 | HTTP client (used by SnippeClient) |

### Module layout

```
server/app/
├── main.py     Routes, middleware, startup, webhook verification
├── schemas.py  Pydantic models for all request/response shapes
├── store.py    SQLite persistence (PaymentRecord dataclass + SQLitePaymentStore)
└── snippe.py   Snippe SDK wrapper (with fallback stub mode)
```

### Routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/payments/create-link` | Create a payment record in the DB (no Snippe call yet) |
| `POST` | `/payments/{id}/initiate` | Trigger USSD push via Snippe — called when parent clicks Pay |
| `GET` | `/payments` | List all payments (newest first, limit 100) |
| `GET` | `/payments/{id}` | Get full details of one payment |
| `POST` | `/webhooks/snippe` | Receive payment status updates from Snippe |
| `GET` | `/health` | Liveness check |

### Data layer (`store.py`)

`PaymentRecord` is a Python dataclass with these fields:

```
payment_id        UUID (primary key)
student_name      str
student_id        str
phone_number      str — parent's mobile number for USSD push
amount            int — amount in smallest currency unit
currency          str — e.g. "TZS"
parent_email      str | None
description       str | None — e.g. "Term 2 Tuition"
status            pending | succeeded | failed | voided | expired
snippe_reference  str | None — Snippe's internal payment reference, set after initiate
snippe_link       str | None — Snippe checkout URL (null for mobile/USSD payments)
metadata          dict — echoed back in Snippe webhooks for payment matching
```

`SQLitePaymentStore` wraps a single `sqlite3.Connection` (thread-safe with `check_same_thread=False`) and exposes:

- `create(record)` — insert a new record
- `get(payment_id)` → `PaymentRecord | None`
- `update_status(payment_id, status, snippe_reference)` — used by both `initiate` and the webhook handler
- `list(limit)` → list of records ordered newest first
- `is_duplicate_event(event_id)` / `mark_event_processed(event_id)` — idempotency guard for webhooks

There are two tables: `payments` and `processed_webhook_events`.

### Snippe wrapper (`snippe.py`)

`SnippeClient` wraps the Snippe SDK's `create_mobile_payment` call with:
- **Retry logic** — up to 3 attempts with exponential backoff (2s, 4s) for server/rate-limit errors
- **No-retry errors** — `AuthenticationError`, `ForbiddenError`, `ValidationError`, `UnprocessableEntityError` fail immediately
- **Stub mode** — if the SDK is not installed or `SNIPPE_API_KEY` is missing, returns a fake UUID reference with `payment_link_url: None`. This lets the system run locally without a real Snippe account.

`verify_webhook` wraps the SDK's `verify_webhook` function and returns a `bool`. The backend also has its own HMAC-SHA256 verification in `main.py` as a second line of defence.

### Webhook verification

Incoming webhooks to `POST /webhooks/snippe` are verified with HMAC-SHA256:

```
message  = "{timestamp}.{raw_body}"
expected = HMAC-SHA256(SNIPPE_WEBHOOK_SECRET, message)
```

The timestamp is also checked against a 5-minute window (`WEBHOOK_MAX_AGE_SECONDS=300`) to reject replayed requests. Duplicate events are discarded using the `processed_webhook_events` table.

---

## Payment flow

```
Bursar                  Frontend              Backend               Snippe
  │                        │                      │                    │
  │  Fill form + click      │                      │                    │
  │──Generate link─────────▶│                      │                    │
  │                        │──POST /create-link──▶│                    │
  │                        │                      │  save to DB        │
  │                        │◀── 201 {payment_id} ─│  (no Snippe call)  │
  │                        │                      │                    │
  │  Copy link + send to parent                   │                    │
  │                        │                      │                    │
  ·                        ·                      ·                    ·
  ·  (parent receives link)·                      ·                    ·
  ·                        ·                      ·                    ·
  │                        │                      │                    │
Parent                      │                      │                    │
  │  Opens /pay?payment_id= │                      │                    │
  │──────────────────────▶ │                      │                    │
  │                        │──GET /payments/id───▶│                    │
  │                        │◀── payment details ──│                    │
  │  Reviews amount,        │                      │                    │
  │  selects provider,      │                      │                    │
  │  clicks Pay             │                      │                    │
  │──────────────────────▶ │                      │                    │
  │                        │──POST /id/initiate──▶│                    │
  │                        │                      │──create_mobile_pay▶│
  │                        │                      │                    │  USSD push fires
  │                        │                      │◀── reference ──────│  on parent's phone
  │                        │                      │  save reference    │
  │                        │◀──── {ok: true} ─────│                    │
  │  "Check Your Phone"     │                      │                    │
  │  panel shown            │                      │                    │
  │                        │                      │                    │
  │  Parent approves USSD   │                      │                    │
  ·                        ·                      ·                    │
  ·                        ·                      ·──◀ POST /webhooks ─│
  ·                        ·                      │   verify signature │
  ·                        ·                      │   update status    │
  ·                        ·                      │   mark event done  │
  ·                        ·                      │──▶ 200 ok          │
```

---

## Environment variables

| Variable | Where used | Default |
|----------|-----------|---------|
| `SNIPPE_API_KEY` | Backend — Snippe SDK auth | *(required for live mode)* |
| `SNIPPE_WEBHOOK_SECRET` | Backend — webhook HMAC verification | `test-webhook-secret` |
| `SNIPPE_WEBHOOK_URL` | Backend — passed to Snippe so it knows where to POST | *(required for webhooks)* |
| `FRONTEND_URL` | Backend — builds `callback_url` for Snippe | `http://localhost:5173` |
| `DATABASE_URL` | Backend — SQLite path | `sqlite:///./payments.db` |
| `WEBHOOK_MAX_AGE_SECONDS` | Backend — replay attack window | `300` |
| `VITE_API_URL` | Frontend — backend base URL | `http://localhost:8000` |

The backend uses `python-dotenv` with `find_dotenv()` which searches up the directory tree, so a `.env` at the project root is found regardless of which directory uvicorn is run from. Vite reads `.env` from the directory containing `vite.config.js` (`frontend/`), so `VITE_API_URL` must be in `frontend/.env`.

---

## Running locally

```bash
# Backend
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

For Snippe webhooks to reach the backend, expose it with ngrok:
```bash
ngrok http 8000
# Set SNIPPE_WEBHOOK_URL=https://<your-subdomain>.ngrok.io/webhooks/snippe in .env
```

Run tests:
```bash
cd server
pytest tests/
```
