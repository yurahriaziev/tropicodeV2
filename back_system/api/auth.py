from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.user import User, UserRole
from core.security import verify_pass
from schemas import Token, StudentLogin

from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError

from core import config

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')

@router.post("/auth/token", response_model=Token, tags=['Auth'])
def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    verify = verify_pass(password, user.hashed_password)
    if not verify:
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    payload = {
        'sub':str(user.id),
        'exp':None
    }

    expiration = datetime.now(timezone.utc) + timedelta(minutes=60)
    payload['exp'] = expiration

    acc_t = jwt.encode(payload, config.SECURITY_SECRET_KEY, config.ALGORITHM)

    return {'access_token':acc_t, 'token_type':'bearer'}

@router.post('/auth/student/login', response_model=Token)
def student_login(s: StudentLogin, db:Session = Depends(get_db)):
    student = db.query(User).filter(User.login_code == s.code).first()

    if not student or student.role != UserRole.STUDENT:
        raise HTTPException(status_code=401, detail='Invalid Code')

    payload = {
        'sub':str(student.id),
        'exp':None
    }

    expiration = datetime.now(timezone.utc) + timedelta(minutes=60)
    payload['exp'] = expiration
    acc_token = jwt.encode(payload, config.SECURITY_SECRET_KEY, config.ALGORITHM)

    return {'access_token':acc_token, 'token_type':'bearer'}

def get_current_user(token:str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, config.SECURITY_SECRET_KEY, config.ALGORITHM)
        id:str = payload.get('sub')

        if id is None:
            raise HTTPException(status_code=401, detail='Invalid Credentials')
        
        id = int(id)
        
    except JWTError as je:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    
    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
            
    return user