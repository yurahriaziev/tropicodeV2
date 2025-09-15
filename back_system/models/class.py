from db.session import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey

class GoogleClass(Base):
    __tablename__ = 'classes'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    start_time: Mapped[DateTime] = mapped_column(DateTime(), nullable=False)
    end_time: Mapped[DateTime] = mapped_column(DateTime(), nullable=False)
    tutor_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    google_meet_link: Mapped[str] = mapped_column(String(255), nullable=False)
    google_event_id: Mapped[str] = mapped_column(String(255), nullable=False)
