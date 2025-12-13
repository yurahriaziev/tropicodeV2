from db.session import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Integer
from datetime import datetime, timezone

class Contact(Base):
    __tablename__ = 'contacts'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first: Mapped[str] = mapped_column(String(50), nullable=False)
    last: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(15), nullable=True, unique=True, index=True)
    child_age: Mapped[int] = mapped_column(Integer, nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))