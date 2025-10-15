from fastapi import FastAPI
from db.session import engine, Base
from datetime import datetime, timezone
from api import users, auth, tutors, classes
from fastapi.middleware.cors import CORSMiddleware

from schemas import ServerStatus
from core.config import origins

from core.logger import logger
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="TropicodeAPI")

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
app.include_router(classes.router)

logger.info('Logger test: Tropicode API has started successfully.')
logger.warning("Logger test: This is a sample warning.")
logger.error("Logger test: This is a sample error.")

# Base.metadata.create_all(bind=engine)

@app.get('/', response_model=ServerStatus, tags=['Server Health'])
def server_test():
    '''
    server status
    '''
    return {'status': 'ok', 'timestamp':datetime.now(timezone.utc)}
