import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+mysqlconnector://root:password@localhost:3306/climacast"
)

print(f"URL: {DATABASE_URL}")

if DATABASE_URL.startswith("mysql"):
    url = make_url(DATABASE_URL)
    if url.database:
        db_name = url.database
        base_url = url.set(database="")
        base_engine = create_engine(base_url)
        
        with base_engine.connect() as conn:
            print(f"Creating database {db_name} if not exists...")
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}`"))
            conn.commit()
            print("Done!")
