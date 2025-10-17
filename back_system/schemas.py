from pydantic import BaseModel, EmailStr
from models.user import UserRole
from datetime import datetime
from typing import Optional

# data in
class UserCreate(BaseModel):
    first: str
    last: str
    age: int
    role: Optional[UserRole] = None

    email: Optional[EmailStr] = None
    password: Optional[str] = None

    login_code: Optional[str] = None

# data out
class UserOut(BaseModel):
    id: int
    first: str
    last: str
    role: UserRole
    email: Optional[EmailStr] = None
    login_code: Optional[str] = None
    is_active: bool
    tutor_gmail: Optional[str] = None

    class Config:
        orm_mode = True

class ServerStatus(BaseModel):
    status: str
    timestamp: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentCreate(BaseModel):
    first: str
    last: str
    age: int

class StudentLogin(BaseModel):
    code: str

class ClassCreate(BaseModel):
    title: str
    start_time: str
    student_id: int

class GoogleClassOut(BaseModel):
    id: int
    title: str
    start_time: datetime
    end_time: datetime
    google_meet_link: str

class AdminActivityOut(BaseModel):
    id: int
    admin_id: int
    action: str
    target: Optional[str] = None
    details: Optional[str | dict] = None
    timestamp: datetime

    class Config:
        orm_mode = True