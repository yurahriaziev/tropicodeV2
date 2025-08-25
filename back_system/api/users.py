from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
import string
from typing import List

from db.session import SessionLocal, engine
from models.user import User, UserRole
import schemas
from core.security import get_password_hash
from .auth import get_current_user

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

@router.post('/users/student', response_model=schemas.UserOut, tags=['Students'])
def student(student:schemas.StudentCreate, db: Session = Depends(get_db), user:User = Depends(get_current_user)):
    if user.role not in [UserRole.TUTOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail='Permission Denied')
    
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        if not db.query(User).filter(User.login_code == code).first():
            login_code = code
            break

    db_student = User(
        first=student.first,
        last=student.last,
        age=student.age,
        role=UserRole.STUDENT,
        login_code=login_code
    )

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
