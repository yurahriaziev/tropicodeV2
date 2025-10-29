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
from db.redis_client import redis_client

import os
import secrets

LOG_DIR = os.path.join(os.path.dirname(__file__), "../core/logs/tropicode_api.log")
frontend_url = os.getenv('FRONTEND_API', 'http://localhost:5173')

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
    
@router.get('/logs', tags=['Admin'])
def get_logs(admin: User = Depends(get_admin_user)):
    try:
        if not os.path.exists(LOG_DIR):
            raise HTTPException(status_code=404, detail='Log file not found')
        
        with open(LOG_DIR, 'r') as file:
            lines = file.readlines()[-100:]

        return {'lines':[line.strip() for line in lines]}
    except Exception as e:
        logger.info(f'[ADMIN]user_id={admin.id} | route=/api/admin/logs | error=Failed to read logs: {e}')

@router.post('/messages', tags=['Admin'])
def send_messages(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    pass

@router.post('/users', tags=['Admin'])
def create_user(user:UserCreate, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    pass

@router.post('/onboarding-link', tags=['Admin'])
def generate_onboarding_link(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    token = secrets.token_urlsafe(32)
    redis_client.setex(f'onboard:{token}', 86400, 'TUTOR')

    tutor_link = f'{frontend_url}/onboard?t={token}&aid={admin.id}'

    log_admin_action(admin.id, 'GENERATE_TUTOR_LINK', details=tutor_link, db=db)
    logger.info(f"[ADMIN] user_id={admin.id} | route=/api/admin/onboarding-link | action=Generated tutor link")

    return {'invite_link': tutor_link}