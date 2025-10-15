from db.session import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, DateTime, Text
from datetime import datetime, timezone

class AdminActivity(Base):
    __tablename__ = 'admin_activity'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    target: Mapped[str] = mapped_column(String(50), nullable=True)
    details: Mapped[Text] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))