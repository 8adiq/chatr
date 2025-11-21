# Base image
FROM python:3.11-slim

# Working directory
WORKDIR /app

# Non-root user
RUN addgroup --system app && adduser --system --group app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Change ownership
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Use Railway's dynamic port
ENV PORT 8080
EXPOSE $PORT

# Command to run the app with dynamic port
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --log-level info --access-log"]
