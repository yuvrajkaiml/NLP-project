import collections
import threading
from typing import Any, Optional, Tuple

class ThreadSafeLRUCache:
    """In-memory thread-safe LRU cache for translations."""
    def __init__(self, capacity: int = 1000):
        self.capacity = capacity
        self.cache = collections.OrderedDict()
        self.lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self.lock:
            if key not in self.cache:
                return None
            self.cache.move_to_end(key)
            return self.cache[key]

    def set(self, key: str, value: Any) -> None:
        with self.lock:
            if key in self.cache:
                self.cache.move_to_end(key)
            self.cache[key] = value
            if len(self.cache) > self.capacity:
                self.cache.popitem(last=False)

    def clear(self) -> None:
        with self.lock:
            self.cache.clear()

    def size(self) -> int:
        with self.lock:
            return len(self.cache)

translation_cache = ThreadSafeLRUCache(capacity=2000)
