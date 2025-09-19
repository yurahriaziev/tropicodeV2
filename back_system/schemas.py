from pydantic import BaseModel, EmailStr
from models.user import UserRole
from datetime import datetime
from typing import Optional

# data in
class UserCreate(BaseModel):
    first: str
    last: str
    age: int
    role: UserRole

    email: Optional[EmailStr] = None
    # hash password later
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
    # hashed_password: Optional[str] = None
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

class NewClass(BaseModel):
    pass