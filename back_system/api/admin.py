from fastapi import APIRouter, Depends, HTTPException
from core.logger import logger
from core.admin_logger import log_admin_action
from .auth import get_admin_user
from schemas import AdminActivityOut

from models.user import UserRole, User
from models import AdminActivity
from schemas import UserCreate
from typing import List

from db.session import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix='/admin')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/users', tags=['Admin'])
def get_all_users(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    users = db.query(User).count()
    tutors = db.query(User).filter(User.role == UserRole.TUTOR).count()
    students = db.query(User).filter(User.role == UserRole.STUDENT).count()

    return {'total_users':users, 'total_tutors':tutors, 'total_students':students}

@router.get('/activity', tags=['Admin'], response_model=List[AdminActivityOut])
def get_activity(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    activities = db.query(AdminActivity).order_by(AdminActivity.timestamp.desc())
    return activities
    

@router.post('/messages', tags=['Admin'])
def send_messages(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    pass

@router.post('/users', tags=['Admin'])
def create_user(user:UserCreate, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    pass

@router.post('/onboarding-link', tags=['Admin'])
def generate_onboarding_link(admin: User = Depends(get_admin_user)):
    pass

@router.get('/logs', tags=['Admin'])
def get_logs(admin: User = Depends(get_admin_user)):
    pass