import math
import requests
from concurrent.futures import ThreadPoolExecutor, wait, ALL_COMPLETED
from core import AUTH_HEADERS, AUTH_HOST, AUTH_PORT, AUTH_SCHEMA

class UserCreator:
    _PREFIXES = {
        1: "One",
        2: "Two",
        3: "Three",
        4: "Four",
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
        10: "Ten",
        11: "Eleven",
        12: "Twelve",
    }

    def __init__(self, begin: int, end: int):
        self._begin = begin
        self._end = end

    def create(self):
        print(f"Creating users from {self._begin} to {self._end}")

        for i in range(self._begin, self._end + 1):
            self._create_core(i)

        print(f"Created users from {self._begin} to {self._end}")
    
    def _create_core(self, index: int):
        user = self._create_data(index)
        try:
            requests.post(f"{AUTH_SCHEMA}://{AUTH_HOST}:{AUTH_PORT}/api/users", json=user, headers=AUTH_HEADERS)
        except Exception as e:
            print(f"User failed to create: {user}, Error: {e}")
            raise
    
    def _create_data(self, index: int):
        fill = int(math.log10(self._end - self._begin + 1) + 1)
        name: str
        email: str
        for i in range(len(UserCreator._PREFIXES), 0, -1):
            if ((index % i) == 0):
                name = f"Python {UserCreator._PREFIXES[i]} User {str(index + 1).zfill(fill)}"
                email = f"python-{UserCreator._PREFIXES[i].lower()}-user-{str(index + 1).zfill(fill)}@example.com"
                break
    
        return {
            "name": name,
            "email": email
        }

def _create():
    arguments = list[tuple[int, int]]()

    # Create 1000 users.
    for i in range(0, 10):
        begin = i * 100
        end = begin + 99
        arguments.append((begin, end))
        
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(_create_task, arg[0], arg[1]) for arg in arguments]
        wait(futures, return_when=ALL_COMPLETED)

def _create_task(begin: int, end: int):
    creator = UserCreator(begin, end)
    creator.create()

if __name__ == "__main__":
    _create()
