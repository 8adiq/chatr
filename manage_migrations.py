#!/usr/bin/env python3
"""
Migration management script for the FastAPI auth app.
Usage:
    python manage_migrations.py init          # Initialize migrations (first time)
    python manage_migrations.py migrate       # Create a new migration
    python manage_migrations.py upgrade       # Apply migrations
    python manage_migrations.py downgrade     # Rollback last migration
    python manage_migrations.py current       # Show current migration
    python manage_migrations.py history       # Show migration history
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    command = sys.argv[1]
    
    if command == "init":
        print("Initializing Alembic migrations...")
        run_command("alembic init migrations")
        print("✅ Migration initialized. Please update migrations/env.py with your models.")
        
    elif command == "migrate":
        message = sys.argv[2] if len(sys.argv) > 2 else "Auto-generated migration"
        print(f"Creating migration: {message}")
        run_command(f'alembic revision --autogenerate -m "{message}"')
        
    elif command == "upgrade":
        print("Applying migrations...")
        run_command("alembic upgrade head")
        
    elif command == "downgrade":
        print("Rolling back last migration...")
        run_command("alembic downgrade -1")
        
    elif command == "current":
        print("Current migration:")
        run_command("alembic current")
        
    elif command == "history":
        print("Migration history:")
        run_command("alembic history")
        
    else:
        print(f"Unknown command: {command}")
        print(__doc__)

if __name__ == "__main__":
    main() 