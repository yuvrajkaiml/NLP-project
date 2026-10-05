from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from typing import Generator
from app.config import get_settings

settings = get_settings()

# For SQLite, check_same_thread needs to be False for multiple threads
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db() -> Generator[Session, None, None]:
    init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
