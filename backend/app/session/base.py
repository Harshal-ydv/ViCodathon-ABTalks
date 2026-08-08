from abc import ABC, abstractmethod
from typing import Optional

class SessionStore(ABC):
    @abstractmethod
    def create_session(self, session_id: str, data: dict) -> None:
        pass

    @abstractmethod
    def get_session(self, session_id: str) -> Optional[dict]:
        pass

    @abstractmethod
    def update_session(self, session_id: str, data: dict) -> None:
        pass

    @abstractmethod
    def delete_session(self, session_id: str) -> None:
        pass
