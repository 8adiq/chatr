# Stage 1: Build stage with build dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Create a non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Install build dependencies needed for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install dependencies into a virtual environment
ENV VIRTUAL_ENV=/app/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final production stage
FROM python:3.11-slim as final

WORKDIR /app

# Create the same non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Copy the virtual environment from the builder stage
COPY --from=builder /app/venv /app/venv

# Copy the application code
COPY alembic.ini .
COPY manage_migrations.py .
COPY app/ ./app/

ENV PATH="/app/venv/bin:$PATH"

USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
