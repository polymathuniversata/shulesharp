"""Run this once to diagnose the Snippe API issue: python debug_snippe.py"""
import httpx
from dotenv import load_dotenv, find_dotenv
import os, json

load_dotenv(find_dotenv())

API_KEY = os.getenv("SNIPPE_API_KEY", "")
WEBHOOK_URL = os.getenv("SNIPPE_WEBHOOK_URL", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
payment_id = "debug-test-001"

def post(label, payload):
    print(f"\n{'='*50}")
    print(f"TEST: {label}")
    print(json.dumps(payload, indent=2))
    r = httpx.post(
        "https://api.snippe.sh/api/v1/payments",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=15,
    )
    print(f"→ {r.status_code}: {r.text}")
    return r.status_code < 300

headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# Step 1: verify the key works at all (read endpoint)
print("\n=== STEP 1: API key check (GET /payments) ===")
r = httpx.get("https://api.snippe.sh/api/v1/payments", headers=headers, timeout=10)
print(f"→ {r.status_code}: {r.text[:300]}")

# Step 2: check balance endpoint
print("\n=== STEP 2: GET /balance ===")
r = httpx.get("https://api.snippe.sh/api/v1/balance", headers=headers, timeout=10)
print(f"→ {r.status_code}: {r.text[:300]}")

# Step 3: minimal mobile payment — absolute bare minimum
print("\n=== STEP 3: bare minimum mobile payload ===")
r = httpx.post("https://api.snippe.sh/api/v1/payments", headers=headers, timeout=10, json={
    "payment_type": "mobile",
    "details": {"amount": 700, "currency": "TZS"},
    "phone_number": "0712345678",
    "customer": {"firstname": "Test", "lastname": "User"},
})
print(f"→ {r.status_code}: {r.text}")

# Step 4: same but with customer email
print("\n=== STEP 4: with customer email ===")
r = httpx.post("https://api.snippe.sh/api/v1/payments", headers=headers, timeout=10, json={
    "payment_type": "mobile",
    "details": {"amount": 700, "currency": "TZS"},
    "phone_number": "0712345678",
    "customer": {"firstname": "Test", "lastname": "User", "email": "test@example.com"},
})
print(f"→ {r.status_code}: {r.text}")

# Step 5: try the Snippe SDK directly (in case headers differ)
print("\n=== STEP 5: via Snippe SDK directly ===")
try:
    from snippe import Snippe
    from snippe.models import Customer
    client = Snippe(API_KEY)
    p = client.create_mobile_payment(
        amount=700,
        currency="TZS",
        phone_number="0712345678",
        customer=Customer(firstname="Test", lastname="User"),
    )
    print(f"✓ SDK SUCCESS: reference={p.reference} status={p.status}")
except Exception as e:
    print(f"✗ SDK error ({type(e).__name__}): {e}")
    if hasattr(e, 'code'):
        print(f"  code={e.code} error_code={getattr(e, 'error_code', '?')}")
