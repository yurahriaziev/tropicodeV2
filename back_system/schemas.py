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

    class Config:
        orm_mode = True

class ServerStatus(BaseModel):
    status: str
    timestamp: datetime