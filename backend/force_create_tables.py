import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import engine, Base
from app.models.user import User
from sqlalchemy import inspect

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")

inspector = inspect(engine)
print(f"Tables: {inspector.get_table_names()}")
