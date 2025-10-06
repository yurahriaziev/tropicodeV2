FROM python:3.11-slim

WORKDIR /tropicode/back_system

COPY requirements.txt /tropicode/requirements.txt
RUN pip install --no-cache-dir -r /tropicode/requirements.txt

COPY back_system /tropicode/back_system

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]