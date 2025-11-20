# Use a modern, slim Python image as a base for a smaller final image.
FROM python:3.11-slim

# Set the working directory inside the container.
WORKDIR /app

# Create a non-root user and group to run the application for better security.
# This prevents the application from running with root privileges.
RUN addgroup --system app && adduser --system --group app

# Install system-level dependencies required by some Python packages (like psycopg2-binary).
# Using --no-install-recommends keeps the image size smaller.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker's layer caching.
# This layer will only be rebuilt if your dependencies in requirements.txt change.
COPY requirements.txt .

# Install the Python dependencies.
# --no-cache-dir reduces the image size by not storing the pip cache.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container.
COPY . .

# Change the ownership of all application files to the non-root user.
RUN chown -R app:app /app

# Switch to the non-root user to run the application.
USER app

# Expose the port the app will run on. Railway will automatically detect and use this.
EXPOSE 8000

# Define the command to run your application when the container starts.
# This correctly points to the 'app' object inside your 'app/main.py' file.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
