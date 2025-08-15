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

ENV DATABASE_URL=postgresql://chatr_db_user:je1mJyMb7QehDE8V9TLEPS65pRgiy2i3@dpg-d2aj2ls9c44c738u619g-a.oregon-postgres.render.com/chatr_db
ENV SECRET_KEY=sA3Tx14UuW9bM5YqFgx7N9yZGVVUqpqCGlTzV_4Fy1Q
ENV CORS_ALLOWED_ORIGINS=http://localhost:5173
ENV ACCESS_TOKEN_EXPIRES_MINUTES=30
ENV ACCESS_TOKEN_EXPIRES_DAYS=7
ENV PYTHONPATH=/app


EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]