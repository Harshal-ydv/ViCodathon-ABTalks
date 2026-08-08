import sqlite3
import json
import os
from typing import Optional
from datetime import datetime, timezone
from .base import SessionStore

class SQLiteSessionStore(SessionStore):
    def __init__(self, db_path: str = "backend/sessions.db"):
        # Ensure directory exists
        os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        return sqlite3.connect(self.db_path, check_same_thread=False)

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    data TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                )
            """)
            conn.commit()

    def create_session(self, session_id: str, data: dict) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO sessions (session_id, data, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (session_id, json.dumps(data), now, now)
            )
            conn.commit()

    def get_session(self, session_id: str) -> Optional[dict]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT data FROM sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
            return None

    def update_session(self, session_id: str, data: dict) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            conn.execute(
                "UPDATE sessions SET data = ?, updated_at = ? WHERE session_id = ?",
                (json.dumps(data), now, session_id)
            )
            conn.commit()

    def delete_session(self, session_id: str) -> None:
        with self._get_connection() as conn:
            conn.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
            conn.commit()
