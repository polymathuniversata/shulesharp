import hashlib
import hmac
import json
import time

from fastapi.testclient import TestClient

from app.main import WEBHOOK_SECRET, app

client = TestClient(app)


def make_signature(payload: bytes, timestamp: str) -> str:
    message = f"{timestamp}.{payload.decode('utf-8')}"
    return hmac.new(WEBHOOK_SECRET.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).hexdigest()


def test_create_payment_link_returns_pending_link() -> None:
    response = client.post(
        '/payments/create-link',
        json={
            'student_name': 'Jane Doe',
            'student_id': 'S123',
            'amount': 12000,
            'currency': 'NGN',
            'parent_email': 'parent@example.com',
            'description': 'School fees Term 2',
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body['payment_id']
    assert body['snippe_link'].startswith('https://snippe.sh/pay/')
    assert body['status'] == 'pending'


def test_get_payment_returns_created_record() -> None:
    create_response = client.post(
        '/payments/create-link',
        json={
            'student_name': 'John Smith',
            'student_id': 'S456',
            'amount': 18000,
            'currency': 'NGN',
        },
    )
    payment_id = create_response.json()['payment_id']

    get_response = client.get(f'/payments/{payment_id}')
    assert get_response.status_code == 200
    payload = get_response.json()
    assert payload['payment_id'] == payment_id
    assert payload['student_name'] == 'John Smith'
    assert payload['amount'] == 18000
    assert payload['status'] == 'pending'


def test_get_payment_not_found_returns_404() -> None:
    response = client.get('/payments/not-found-id')
    assert response.status_code == 404
    assert response.json()['detail'] == 'Payment not found'


def test_healthcheck_returns_ok() -> None:
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok', 'database': 'connected'}


def test_webhook_invalid_signature_returns_400() -> None:
    payload = json.dumps({
        'event_type': 'payment.updated',
        'payment_id': 'missing-id',
        'status': 'succeeded',
    }).encode('utf-8')
    timestamp = str(int(time.time()))
    response = client.post(
        '/webhooks/snippe',
        content=payload,
        headers={
            'Snippe-Signature': 'invalid-signature',
            'Snippe-Timestamp': timestamp,
        },
    )
    assert response.status_code == 400
    assert response.json()['detail'] == 'Invalid webhook signature'


def test_webhook_success_updates_payment_status() -> None:
    create_response = client.post(
        '/payments/create-link',
        json={
            'student_name': 'Mary Johnson',
            'student_id': 'S789',
            'amount': 25000,
            'currency': 'NGN',
        },
    )
    payment_id = create_response.json()['payment_id']

    event = {
        'event_type': 'payment.updated',
        'payment_id': payment_id,
        'status': 'succeeded',
        'data': {'reference_id': 'reference-1234'},
    }
    payload = json.dumps(event).encode('utf-8')
    timestamp = str(int(time.time()))
    signature = make_signature(payload, timestamp)
    webhook_response = client.post(
        '/webhooks/snippe',
        content=payload,
        headers={
            'Snippe-Signature': signature,
            'Snippe-Timestamp': timestamp,
        },
    )
    assert webhook_response.status_code == 200
    assert webhook_response.json()['ok'] is True
    assert webhook_response.json()['status'] == 'succeeded'

    get_response = client.get(f'/payments/{payment_id}')
    assert get_response.status_code == 200
    payload = get_response.json()
    assert payload['status'] == 'succeeded'
    assert payload['snippe_reference'] == 'reference-1234'
