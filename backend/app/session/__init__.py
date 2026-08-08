from .sqlite_store import SQLiteSessionStore

_store_instance = None

def get_session_store():
    global _store_instance
    if _store_instance is None:
        _store_instance = SQLiteSessionStore()
    return _store_instance
