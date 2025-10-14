from dotenv import load_dotenv
import os

load_dotenv()

SECURITY_SECRET_KEY = os.getenv('SECURITY_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

origins = [
    'http://localhost:5173',
    'https://tropicode.tech'
]