from __future__ import annotations

import hmac
import hashlib
import logging
import os
import time
import uuid
from typing import Any

from dotenv import load_dotenv, find_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from .schemas import (
    CreateLinkRequest,
    CreateLinkResponse,
    CreateStudentRequest,
    PaymentListItem,
    PaymentStatus,
    PaymentStatusResponse,
    StudentResponse,
    WebhookEvent,
)
from .snippe import SnippeClient, SnippeClientError
from .store import PaymentRecord, SQLitePaymentStore, Student

load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger('school-payments')

SNIPPE_API_KEY = os.getenv('SNIPPE_API_KEY')
SNIPPE_WEBHOOK_SECRET = os.getenv('SNIPPE_WEBHOOK_SECRET', 'test-webhook-secret')
WEBHOOK_SECRET = SNIPPE_WEBHOOK_SECRET
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./payments.db')
WEBHOOK_MAX_AGE_SECONDS = int(os.getenv('WEBHOOK_MAX_AGE_SECONDS', '300'))
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

app = FastAPI(title='School Payments API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)
store = SQLitePaymentStore(db_url=DATABASE_URL)


def get_snippe_client() -> SnippeClient:
    return SnippeClient(
        api_key=SNIPPE_API_KEY,
        webhook_url=os.getenv('SNIPPE_WEBHOOK_URL'),
    )


def verify_webhook_signature(payload: bytes, signature: str | None, timestamp: str | None, secret: str | None) -> bool:
    if not signature or not timestamp or not secret:
        return False

    try:
        event_time = int(timestamp)
    except ValueError:
        return False

    if abs(time.time() - event_time) > WEBHOOK_MAX_AGE_SECONDS:
        logger.warning('Webhook timestamp is too old: %s', timestamp)
        return False

    message = f'{timestamp}.{payload.decode("utf-8")}'
    computed = hmac.new(secret.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, signature)


@app.post('/payments/create-link', response_model=CreateLinkResponse, status_code=status.HTTP_201_CREATED)
def create_payment_link(request: CreateLinkRequest) -> CreateLinkResponse:
    payment_id = str(uuid.uuid4())
    metadata: dict[str, Any] = {
        'payment_id': payment_id,
        'student_name': request.student_name,
        'student_id': request.student_id,
    }
    logger.info('Creating payment record for %s %s amount=%s %s', request.student_name, request.student_id, request.amount, request.currency)
    record = PaymentRecord(
        payment_id=payment_id,
        student_name=request.student_name,
        student_id=request.student_id,
        phone_number=request.phone_number,
        amount=request.amount,
        currency=request.currency,
        parent_email=request.parent_email,
        description=request.description,
        status=PaymentStatus.pending,
        metadata=metadata,
    )
    store.create(record)
    return CreateLinkResponse(payment_id=payment_id, snippe_link=None, status=PaymentStatus.pending)


@app.post('/payments/{payment_id}/initiate')
def initiate_payment(
    payment_id: str,
    snippe_client: SnippeClient = Depends(get_snippe_client),
) -> JSONResponse:
    record = store.get(payment_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Payment not found')
    if record.status != PaymentStatus.pending:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Payment already completed or voided')
    if record.snippe_reference:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Payment already initiated — check your phone')

    callback_url = f'{FRONTEND_URL}/pay?payment_id={payment_id}'
    try:
        result = snippe_client.create_link(
            amount=record.amount,
            currency=record.currency,
            phone_number=record.phone_number,
            student_name=record.student_name,
            parent_email=str(record.parent_email),
            callback_url=callback_url,
            metadata=record.metadata,
        )
    except SnippeClientError as exc:
        logger.error('Failed to initiate Snippe payment: %s', exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))

    store.update_status(payment_id, PaymentStatus.pending, snippe_reference=result.get('reference'))
    logger.info('USSD initiated for payment_id=%s snippe_ref=%s', payment_id, result.get('reference'))
    return JSONResponse(content={'ok': True})


@app.get('/payments', response_model=list[PaymentListItem])
def list_payments(limit: int = 100) -> list[PaymentListItem]:
    records = store.list(limit=limit)
    return [
        PaymentListItem(
            payment_id=r.payment_id,
            student_name=r.student_name,
            student_id=r.student_id,
            amount=r.amount,
            currency=r.currency,
            status=r.status,
            snippe_link=r.snippe_link,
            snippe_reference=r.snippe_reference,
            description=r.description,
        )
        for r in records
    ]


@app.get('/payments/{payment_id}', response_model=PaymentStatusResponse)
def get_payment(payment_id: str) -> PaymentStatusResponse:
    record = store.get(payment_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Payment not found')
    return PaymentStatusResponse(
        payment_id=record.payment_id,
        student_name=record.student_name,
        student_id=record.student_id,
        amount=record.amount,
        currency=record.currency,
        parent_email=record.parent_email,
        description=record.description,
        status=record.status,
        snippe_reference=record.snippe_reference,
        snippe_link=record.snippe_link,
        metadata=record.metadata,
    )


@app.post('/webhooks/snippe')
async def snippe_webhook(
    request: Request,
    signature: str | None = Header(None, alias='X-Webhook-Signature'),
    timestamp: str | None = Header(None, alias='X-Webhook-Timestamp'),
) -> JSONResponse:
    payload = await request.body()
    signature = signature or request.headers.get('Snippe-Signature')
    timestamp = timestamp or request.headers.get('Snippe-Timestamp')
    logger.info('Received webhook request: headers=%s', {
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp,
        'Snippe-Signature': request.headers.get('Snippe-Signature'),
    })

    if not verify_webhook_signature(payload, signature, timestamp, SNIPPE_WEBHOOK_SECRET):
        logger.warning('Invalid webhook signature detected')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid webhook signature')

    event_json = await request.json()
    event = WebhookEvent(**event_json)
    logger.info('Processing webhook event=%s id=%s', event.normalized_type, event.event_id)

    if store.is_duplicate_event(event.event_id):
        logger.info('Duplicate webhook event ignored: %s', event.event_id)
        return JSONResponse(content={'ok': True, 'duplicate': True, 'event_id': event.event_id})

    payment_id = event.effective_payment_id
    if not payment_id:
        logger.warning('Webhook missing payment_id in payload')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing payment_id in webhook payload')

    status_value = event.effective_status
    if status_value is None:
        logger.warning('Webhook missing status in payload for event_id=%s', event.event_id)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing payment status in webhook payload')

    updated = store.update_status(payment_id=payment_id, status=status_value, snippe_reference=event.data.get('reference') or event.data.get('reference_id'))
    if not updated:
        logger.warning('Payment record not found for webhook payment_id=%s', payment_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Payment record not found')

    store.mark_event_processed(event.event_id)
    logger.info('Webhook processed successfully payment_id=%s status=%s', payment_id, status_value)
    return JSONResponse(content={'ok': True, 'payment_id': payment_id, 'status': status_value})


@app.get('/health')
def healthcheck() -> dict[str, str]:
    try:
        store.conn.execute('SELECT 1').fetchone()
        return {'status': 'ok', 'database': 'connected'}
    except Exception as exc:
        logger.error('Healthcheck database failure: %s', exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Database unavailable')


# ── Students ─────────────────────────────────────────────────────────────────

@app.post('/students', response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(request: CreateStudentRequest) -> StudentResponse:
    student = Student(
        id=str(uuid.uuid4()),
        student_id=request.student_id,
        name=request.name,
        grade=request.grade,
        guardian_name=request.guardian_name,
        phone_number=request.phone_number,
        parent_email=str(request.parent_email),
        tag=request.tag or 'New Admission',
    )
    try:
        store.create_student(student)
    except Exception as exc:
        if 'UNIQUE' in str(exc):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Student ID '{request.student_id}' already exists")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to save student')
    logger.info('Student created: %s (%s)', student.name, student.student_id)
    return StudentResponse(**student.__dict__)


@app.get('/students', response_model=list[StudentResponse])
def list_students() -> list[StudentResponse]:
    return [StudentResponse(**s.__dict__) for s in store.list_students()]


@app.delete('/students/{student_uuid}')
def delete_student(student_uuid: str) -> Response:
    if not store.delete_student(student_uuid):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Student not found')
    return Response(status_code=204)


@app.exception_handler(HTTPException)
def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})
