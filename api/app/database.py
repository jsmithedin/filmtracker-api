import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.exc import SQLAlchemyError


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./filmtracker.db")
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    session = Session(engine)
    try:
        yield session
        session.commit()
    except SQLAlchemyError:
        session.rollback()
        raise
    finally:
        session.close()
