from fastapi import APIRouter, Depends, HTTPException
from core.logger import logger
from core.admin_logger import log_admin_action
from .auth import get_admin_user

from models import User
from schemas import UserCreate

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
    log_admin_action(
        admin_id=admin.id,
        action='TEST_ADMIN_ACTION',
        target='MANUAL TEST',
        db=db
    )

    return {'message': 'Test admin action logged'}

@router.get('/activity', tags=['Admin'])
def get_activity(admin: User = Depends(get_admin_user)):
    pass

@router.post('/messages', tags=['Admin'])
def send_messages(admin: User = Depends(get_admin_user)):
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