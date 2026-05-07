from sqlalchemy.engine.url import make_url

DATABASE_URL = "mysql+mysqlconnector://root:admin123@localhost:3306/climacast"
url = make_url(DATABASE_URL)

print(f"Drivername: {url.drivername}")
print(f"Database: {url.database}")
base_url = url.set(database="")
print(f"Base URL: {base_url}")
