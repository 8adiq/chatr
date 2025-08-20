from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os
from app.config import settings


# db setup
DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db_session():
    """ creating a dependency for db session """
    db: Session = session() 
    try:
        yield db
    finally:
        db.close()

def init_db():
    """ checking if table exits before creating and running migrations"""
    from sqlalchemy import inspect
    import subprocess
    import os

    inspector = inspect(engine)
    
    # Check if all required tables exist
    required_tables = ["Users", "EmailVerificationTokens","Comments","Posts","Likes"]
    missing_tables = []
    
    for table in required_tables:
        if not inspector.has_table(table):
            missing_tables.append(table)
    
    if missing_tables:
        print(f"Creating missing tables: {missing_tables}")
        Base.metadata.create_all(bind=engine)
        print(" All tables created successfully")
    else:
        print(" All required tables already exist")
    
    # Run migrations to ensure schema is up to date
    try:
        print("Running database migrations...")
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd=os.getcwd()
        )
        if result.returncode == 0:
            print(" Migrations applied successfully")
        else:
            print(f" Migration warning: {result.stderr}")
    except Exception as e:
        print(f" Migration error (non-critical): {e}")
        print("Continuing with application startup...")

