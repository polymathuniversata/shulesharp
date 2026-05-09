from __future__ import annotations

import json
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Optional

from .schemas import PaymentStatus


@dataclass
class PaymentRecord:
    payment_id: str
    student_name: str
    student_id: str
    phone_number: str
    amount: int
    currency: str
    parent_email: Optional[str]
    description: Optional[str]
    status: PaymentStatus = PaymentStatus.pending
    snippe_reference: Optional[str] = None
    snippe_link: Optional[str] = None
    metadata: Dict[str, str] = field(default_factory=dict)

    def to_row(self) -> tuple:
        return (
            self.payment_id,
            self.student_name,
            self.student_id,
            self.phone_number,
            self.amount,
            self.currency,
            self.parent_email,
            self.description,
            self.status.value,
            self.snippe_reference,
            self.snippe_link,
            json.dumps(self.metadata),
        )

    @staticmethod
    def from_row(row: sqlite3.Row) -> PaymentRecord:
        metadata = json.loads(row['metadata'] or '{}')
        return PaymentRecord(
            payment_id=row['payment_id'],
            student_name=row['student_name'],
            student_id=row['student_id'],
            phone_number=row['phone_number'] or '',
            amount=row['amount'],
            currency=row['currency'],
            parent_email=row['parent_email'],
            description=row['description'],
            status=PaymentStatus(row['status']),
            snippe_reference=row['snippe_reference'],
            snippe_link=row['snippe_link'],
            metadata=metadata,
        )


class SQLitePaymentStore:
    def __init__(self, db_url: str = 'sqlite:///./payments.db') -> None:
        self.db_path = self._resolve_db_path(db_url)
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._create_tables()

    def _resolve_db_path(self, db_url: str) -> str:
        if db_url.startswith('sqlite:///'):
            path = db_url.replace('sqlite:///', '')
        else:
            path = db_url
        return str(Path(path).expanduser())

    def _create_tables(self) -> None:
        self.conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS payments (
                payment_id TEXT PRIMARY KEY,
                student_name TEXT NOT NULL,
                student_id TEXT NOT NULL,
                phone_number TEXT NOT NULL DEFAULT '',
                amount INTEGER NOT NULL,
                currency TEXT NOT NULL,
                parent_email TEXT,
                description TEXT,
                status TEXT NOT NULL,
                snippe_reference TEXT,
                snippe_link TEXT,
                metadata TEXT NOT NULL DEFAULT '{}'
            )
            '''
        )
        # Safe migration: add phone_number if table existed without it
        try:
            self.conn.execute("ALTER TABLE payments ADD COLUMN phone_number TEXT NOT NULL DEFAULT ''")
        except sqlite3.OperationalError:
            pass  # Column already exists
        self.conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS processed_webhook_events (
                event_id TEXT PRIMARY KEY,
                received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            '''
        )
        self.conn.commit()

    def create(self, record: PaymentRecord) -> None:
        self.conn.execute(
            '''
            INSERT INTO payments (
                payment_id, student_name, student_id, phone_number, amount, currency,
                parent_email, description, status, snippe_reference, snippe_link, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            record.to_row(),
        )
        self.conn.commit()

    def get(self, payment_id: str) -> Optional[PaymentRecord]:
        cursor = self.conn.execute('SELECT * FROM payments WHERE payment_id = ?', (payment_id,))
        row = cursor.fetchone()
        return PaymentRecord.from_row(row) if row else None

    def update_status(self, payment_id: str, status: PaymentStatus, snippe_reference: Optional[str] = None) -> bool:
        record = self.get(payment_id)
        if record is None:
            return False
        updated_reference = snippe_reference or record.snippe_reference
        self.conn.execute(
            'UPDATE payments SET status = ?, snippe_reference = ? WHERE payment_id = ?',
            (status.value, updated_reference, payment_id),
        )
        self.conn.commit()
        return True

    def is_duplicate_event(self, event_id: str) -> bool:
        cursor = self.conn.execute('SELECT 1 FROM processed_webhook_events WHERE event_id = ?', (event_id,))
        return cursor.fetchone() is not None

    def mark_event_processed(self, event_id: str) -> None:
        self.conn.execute('INSERT OR IGNORE INTO processed_webhook_events (event_id) VALUES (?)', (event_id,))
        self.conn.commit()

    def list(self, limit: int = 100) -> list[PaymentRecord]:
        cursor = self.conn.execute(
            'SELECT * FROM payments ORDER BY rowid DESC LIMIT ?',
            (limit,),
        )
        return [PaymentRecord.from_row(row) for row in cursor.fetchall()]
