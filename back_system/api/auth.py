from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.user import User, UserRole
from core.security import verify_pass
from schemas import Token, StudentLogin, Optional
from db.redis_client import redis_client

from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError

from core import config, encryption


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix='/auth')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')

def get_current_user(token:str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, config.SECURITY_SECRET_KEY, config.ALGORITHM)
        id:str = payload.get('sub')

        if id is None:
            raise HTTPException(status_code=401, detail='Invalid Credentials')
        
    except JWTError as je:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    
    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
            
    return user

@router.post("/token", response_model=Token, tags=['Auth'])
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

@router.post('/student/login', response_model=Token)
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

# @router.get('/google/login')
# def google_login(user: User = Depends(get_current_user)):
#     print('got here')
#     auth_url, state = get_google_auth_url()

#     redis_client.set(state, user.id, ex=600)
    
#     print('before return') # LOG
#     return {'url':auth_url, 'state':state}

# @router.get('/google/callback')
# def google_callback(state: str, db: Session = Depends(get_db), code: Optional[str] = None, error: Optional[str] = None):
#     print(error)
#     print('got here 1A')  # LOG
#     stored_state = redis_client.get(state)

#     if stored_state is None:
#         raise HTTPException(status_code=401, detail='Not authorized')
    
#     print('got here 2A')  # LOG
#     user_id = stored_state
#     redis_client.delete(state)

#     print('got here 3A')  # LOG
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user or user.role != UserRole.TUTOR:
#         raise HTTPException(status_code=401, detail='Not authorized')
    
#     tokens = fetch_google_tokens(code)
#     user_info = get_google_user_info(tokens)
#     print(tokens) # LOG
#     print() # LOG
#     print(user_info) # LOG

#     user.tutor_gmail = user_info['email']

#     if tokens.refresh_token:
#         print(tokens.refresh_token) # LOG
#         db_token = encryption.encrypt_token(tokens.refresh_token)
#         user.token = db_token
#     db.commit()

#     return RedirectResponse(url='http://localhost:5173/tropitutor')

