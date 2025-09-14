from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas import UserOut, StudentCreate
from models.user import User, UserRole
from .auth import get_current_user
import string
import random

from db.session import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/tutors/student', response_model=UserOut, tags=['Tutors'])
def student(student:StudentCreate, db: Session = Depends(get_db), user:User = Depends(get_current_user)):
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
        login_code=login_code,
        tutor_id=user.id
    )

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/tutors/me/students", response_model=List[UserOut], tags=['Tutors'])
def get_students(user:User=Depends(get_current_user), db: Session=Depends(get_db)):
    if user.role not in [UserRole.ADMIN, UserRole.TUTOR]:
        raise HTTPException(status_code=403, detail='Permission Denied')
    
    students = db.query(User).filter(User.tutor_id == user.id).all()
    return students