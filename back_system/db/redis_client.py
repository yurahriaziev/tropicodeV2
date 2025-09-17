import redis
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_URL = os.getenv('REDIS_URL')

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

try:
    is_connected = redis_client.ping()

    if is_connected:
        print("Redis connection successful.")
    else:
        print("Redis connection failed.")

except redis.exceptions.ConnectionError as e:
    print(f"Failed to connect to Redis: {e}")