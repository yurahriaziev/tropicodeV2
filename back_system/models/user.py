import enum
from sqlalchemy import String, ForeignKey, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Enum as SAEnum
from db.session import Base

class UserRole(str, enum.Enum):
    ADMIN = 'admin'
    TUTOR = 'tutor'
    STUDENT = 'student'

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first: Mapped[str] = mapped_column(String(50), nullable=False)
    last: Mapped[str] = mapped_column(String(50), nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False)
    tutor_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=True)

    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)
    tutor_gmail: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=True)
    token: Mapped[str] = mapped_column(String, nullable=True)

    login_code: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)

    is_active: Mapped[bool] = mapped_column(default=True)
