FROM python:3.10.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy contents of app folder, not the folder itself
COPY app/ ./
COPY alembic.ini .
COPY manage_migrations.py .

ENV PYTHONPATH=/app

EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
