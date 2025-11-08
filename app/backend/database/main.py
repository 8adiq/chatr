from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os
from backend.config import settings


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
    """ checking if table exits before creating"""
    from sqlalchemy import inspect

    inspector = inspect(engine)
    if not inspector.has_table("Users"):
        Base.metadata.create_all(bind=engine)
        print("Database created")
    else:
        print(f"Database table already exists")

