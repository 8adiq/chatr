from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from app.config import get_settings

Base = declarative_base()

def get_engine():
    settings = get_settings()  # get settings at runtime
    return create_engine(settings.database_url)

def get_sessionmaker():
    return sessionmaker(autocommit=False, autoflush=False, bind=get_engine())

def get_db_session():
    """ Dependency for db session """
    db: Session = get_sessionmaker()()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """ Create tables if they don't exist """
    from sqlalchemy import inspect

    engine = get_engine()
    inspector = inspect(engine)

    if not inspector.has_table("Users"):
        Base.metadata.create_all(bind=engine)
        print("Database created")
    else:
        print("Database table already exists")
