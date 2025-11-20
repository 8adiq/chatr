# Use a modern, slim Python image as the base
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Create a non-root user to run the application for better security
RUN useradd --create-home appuser
USER appuser

# Copy only the requirements file first to leverage Docker's caching mechanism.
# This layer will only be rebuilt if your dependencies change.
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

# Add the user's local bin to the PATH. This is where pip installs packages with --user.
ENV PATH="/home/appuser/.local/bin:${PATH}"

# Expose the port the app runs on. Railway will automatically map this.
EXPOSE 8000

# Define the command to run your application.
# This command will be run when the container starts.
# We use app.main:app because your main.py is inside the 'app' directory.
# The port is set to 8000, which Railway will use.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

