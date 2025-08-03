from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os
from dotenv import load_dotenv


load_dotenv()

# db setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
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

