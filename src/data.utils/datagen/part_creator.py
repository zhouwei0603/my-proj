import math
import requests
from concurrent.futures import ThreadPoolExecutor, wait, ALL_COMPLETED
from core import HEADERS, HOST, PORT, SCHEMA

class PartCreator:
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
        print(f"Creating parts from {self._begin} to {self._end}")

        for i in range(self._begin, self._end + 1):
            self._create_core(i)

        print(f"Created parts from {self._begin} to {self._end}")
    
    def _create_core(self, index: int):
        part = self._create_data(index)
        try:
            requests.post(f"{SCHEMA}://{HOST}:{PORT}/api/parts", json=part, headers=HEADERS)
        except Exception as e:
            print(f"Part failed to create: {part}, Error: {e}")
            raise
    
    def _create_data(self, index: int):
        fill = int(math.log10(self._end - self._begin + 1) + 1)
        name: str
        for i in range(len(PartCreator._PREFIXES), 0, -1):
            if ((index % i) == 0):
                name = f"Python {PartCreator._PREFIXES[i]} Part {str(index + 1).zfill(fill)}"
                break
    
        return {
            "name": name
        }

def _create():
    arguments = list[tuple[int, int]]()

    # Create 1000 parts.
    for i in range(0, 10):
        begin = i * 100
        end = begin + 99
        arguments.append((begin, end))
        
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(_create_task, arg[0], arg[1]) for arg in arguments]
        wait(futures, return_when=ALL_COMPLETED)

def _create_task(begin: int, end: int):
    creator = PartCreator(begin, end)
    creator.create()

if __name__ == "__main__":
    _create()
