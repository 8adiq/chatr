FROM python:3.10.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* 

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory
COPY app/ ./app/
COPY alembic.ini .
COPY manage_migrations.py .

ENV PYTHONPATH=/app

EXPOSE 8000

# Command to run the application
# Railway sets PORT environment variable, use it if available
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}