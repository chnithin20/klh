import sqlite3
from config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn