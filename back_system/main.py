from fastapi import FastAPI
from db.session import engine, Base
from datetime import datetime, timezone
from api import users, auth, tutors
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from schemas import ServerStatus
from core.config import origins

import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="TropicodeAPI")

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv('SESSION_SECRET'),
    same_site='lax',
    https_only=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(tutors.router)

# Base.metadata.create_all(bind=engine)

@app.get('/', response_model=ServerStatus, tags=['Server Health'])
def server_test():
    '''
    server status
    '''
    return {'status': 'ok', 'timestamp':datetime.now(timezone.utc)}
