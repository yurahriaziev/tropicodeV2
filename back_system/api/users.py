from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
import string
from typing import List

from db.session import SessionLocal, engine
from models.user import User, UserRole
import schemas
from core.security import get_password_hash
from core.logger import logger
from .auth import get_current_user
from services.user_service import create_contact_service

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/", response_model=schemas.UserOut, status_code=201, tags=['Users'])
def create_user(user:schemas.UserCreate, db: Session = Depends(get_db)):
    '''
    add new user
    '''
    if user.email and db.query(User).filter(User.email == user.email).first():
        logger.warning(f"[USER_CREATE] Attempted to create user with existing email: {user.email}")
        raise HTTPException(status_code=400, detail='Email already in use')
    
    hashed_p = None
    if user.role in [UserRole.ADMIN, UserRole.TUTOR]:
        if not user.email or not user.password:
            raise HTTPException(status_code=400, detail="Email and password are required")

    login_code = None
    if user.role == UserRole.STUDENT:
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            if not db.query(User).filter(User.login_code == code).first():
                login_code = code
                break

    hashed_p = get_password_hash(user.password)

    db_user = User(
        first=user.first,
        last=user.last,
        age=user.age,
        role=user.role,
        email=user.email,
        hashed_password=hashed_p,
        login_code=login_code
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"[USER_CREATE] Created new user '{user.first} {user.last}' (id={db_user.id}, role={user.role})")
    return db_user

@router.get("/users/", response_model=List[schemas.UserOut], tags=['Users'])
def get_users(db: Session=Depends(get_db)):
    '''
    get all users in a list
    '''
    users = db.query(User).all()
    return users

@router.get('/users/me', response_model=schemas.UserOut, tags=['Users'])
def me(user:User = Depends(get_current_user)):
    return user

@router.post('/contacts', response_model=schemas.ContactOut, tags=['Users'])
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    try:
        return create_contact_service(db, contact)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except:
        raise
        