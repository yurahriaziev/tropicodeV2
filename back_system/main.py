from fastapi import FastAPI
from db.session import engine, Base
from datetime import datetime, timezone
from api import users

import models
from schemas import ServerStatus

app = FastAPI(title="TropicodeAPI")
app.include_router(users.router)

Base.metadata.create_all(bind=engine)

@app.get('/', response_model=ServerStatus, tags=['Server Health'])
def server_test():
    '''
    server status
    '''
    return {'status': 'ok', 'timestamp':datetime.now(timezone.utc)}
