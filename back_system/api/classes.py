from fastapi import APIRouter, Response
from fastapi.responses import RedirectResponse
from services.google_meet_service import get_google_auth_url

router = APIRouter()

@router.get('/google/login')
def google_login(response:Response):
    auth_url, state = get_google_auth_url()

    response.set_cookie(key='state', value=state, httponly=True)

    return RedirectResponse(url=auth_url)