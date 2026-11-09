from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# For SQLite fallback in dev
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    try:
        engine = create_engine(settings.DATABASE_URL)
        # Test connection
        with engine.connect() as conn:
            conn.execute(create_engine(settings.DATABASE_URL).dialect.do_ping)
    except Exception:
        # Fallback to SQLite if PostgreSQL is not available
        import os
        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "supplymind.db")
        engine = create_engine(
            f"sqlite:///{db_path}", connect_args={"check_same_thread": False}
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

