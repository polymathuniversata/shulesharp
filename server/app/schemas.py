from __future__ import annotations

from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PaymentStatus(str, Enum):
    pending = 'pending'
    succeeded = 'succeeded'
    failed = 'failed'
    voided = 'voided'
    expired = 'expired'


class CreateLinkRequest(BaseModel):
    student_name: str = Field(..., min_length=1)
    student_id: str = Field(..., min_length=1)
    phone_number: str = Field(..., min_length=7)
    amount: int = Field(..., gt=0)
    currency: str = Field(default='TZS', min_length=3)
    parent_email: EmailStr
    description: Optional[str] = None


class CreateLinkResponse(BaseModel):
    payment_id: str
    snippe_link: Optional[str] = None
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


class CreateStudentRequest(BaseModel):
    student_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    grade: str = Field(..., min_length=1)
    guardian_name: str = Field(..., min_length=1)
    phone_number: str = Field(..., min_length=7)
    parent_email: EmailStr
    tag: Optional[str] = 'New Admission'


class StudentResponse(BaseModel):
    id: str
    student_id: str
    name: str
    grade: str
    guardian_name: str
    phone_number: str
    parent_email: str
    tag: str


class PaymentListItem(BaseModel):
    payment_id: str
    student_name: str
    student_id: str
    amount: int
    currency: str
    status: PaymentStatus
    snippe_link: Optional[str] = None
    snippe_reference: Optional[str] = None
    description: Optional[str] = None


class WebhookEvent(BaseModel):
    model_config = ConfigDict(extra='ignore')

    # Snippe webhook fields (flat payload)
    event: Optional[str] = None       # 'payment.completed', 'payment.failed', etc.
    reference: Optional[str] = None   # Snippe payment reference
    status: Optional[str] = None      # 'completed', 'failed', 'expired', 'voided'
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[int] = None

    # Legacy / fallback field names kept for compatibility
    id: Optional[str] = None
    type: Optional[str] = None
    payment_id: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)

    @property
    def normalized_type(self) -> Optional[str]:
        return self.event or self.type

    @property
    def event_id(self) -> str:
        return self.reference or self.id or f'{self.normalized_type or "unknown"}-{self.payment_id or "missing"}'

    @property
    def effective_payment_id(self) -> Optional[str]:
        # Snippe embeds our payment_id in metadata at the top level
        return (
            self.metadata.get('payment_id')
            or self.payment_id
            or self.data.get('metadata', {}).get('payment_id')
        )

    @property
    def effective_status(self) -> Optional[PaymentStatus]:
        status_value = self.status or self.data.get('status') or self.data.get('payment_status')
        if status_value is None:
            return None
        # Snippe uses 'completed'; our enum uses 'succeeded'
        if status_value == 'completed':
            status_value = 'succeeded'
        try:
            return PaymentStatus(status_value)
        except ValueError:
            return None
