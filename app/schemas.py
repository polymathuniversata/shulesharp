from __future__ import annotations

from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr, Field


class PaymentStatus(str, Enum):
    pending = 'pending'
    succeeded = 'succeeded'
    failed = 'failed'
    voided = 'voided'
    expired = 'expired'


class CreateLinkRequest(BaseModel):
    student_name: str = Field(..., min_length=1)
    student_id: str = Field(..., min_length=1)
    amount: int = Field(..., gt=0)
    currency: str = Field(default='NGN', min_length=3)
    parent_email: Optional[EmailStr] = None
    description: Optional[str] = None


class CreateLinkResponse(BaseModel):
    payment_id: str
    snippe_link: str
    status: PaymentStatus


class PaymentStatusResponse(BaseModel):
    payment_id: str
    student_name: str
    student_id: str
    amount: int
    currency: str
    parent_email: Optional[EmailStr] = None
    description: Optional[str] = None
    status: PaymentStatus
    snippe_reference: Optional[str] = None
    snippe_link: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class WebhookEvent(BaseModel):
    id: Optional[str] = None
    type: Optional[str] = None
    event_type: Optional[str] = Field(None, alias='event_type')
    payment_id: Optional[str] = None
    status: Optional[str] = None
    api_version: Optional[str] = None
    created_at: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)

    @property
    def normalized_type(self) -> Optional[str]:
        return self.type or self.event_type

    @property
    def event_id(self) -> str:
        if self.id:
            return self.id
        return f'{self.normalized_type or "unknown"}-{self.payment_id or "missing"}'

    @property
    def effective_payment_id(self) -> Optional[str]:
        if self.payment_id:
            return self.payment_id

        metadata = self.data.get('metadata') or {}
        url_metadata = metadata.get('url_metadata') or {}
        return (
            metadata.get('payment_id')
            or url_metadata.get('payment_id')
            or metadata.get('order_id')
            or self.data.get('external_reference')
            or self.data.get('reference')
        )

    @property
    def effective_status(self) -> Optional[PaymentStatus]:
        status_value = self.status or self.data.get('status') or self.data.get('payment_status')
        if status_value is None:
            return None
        try:
            return PaymentStatus(status_value)
        except ValueError:
            return None
