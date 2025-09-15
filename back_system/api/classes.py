from fastapi import APIRouter, Response, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from services.google_meet_service import get_google_auth_url, fetch_google_tokens
from sqlalchemy.orm import Session
from db.session import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.get('/google/login')
def google_login(response:Response):
    auth_url, state = get_google_auth_url()

    response.set_cookie(key='state', value=state, httponly=True)

    return RedirectResponse(url=auth_url)

@router.get('/auth/google/callback')
def google_callback(request: Request, code: str, state: str, db: Session = Depends(get_db)):
    stored_state = request.cookies.get('state')
    if stored_state != state:
        raise HTTPException(status_code=401, detail='Not authorized')
    
    tokens = fetch_google_tokens(code)
    