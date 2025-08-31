import math
import requests
from core import HEADERS, HOST, PORT, SCHEMA

class PartCreator:
    MAX_PARTS = 1000
    part_ids = list[str]()

    __PREFIXES = {
        12: "Twelve",
        11: "Eleven",
        10: "Ten",
        9: "Nine",
        8: "Eight",
        7: "Seven",
        6: "Six",
        5: "Five",
        4: "Four",
        3: "Three",
        2: "Two",
        1: "One"
    }

    def __init__(self):
        pass

    def create(self):
        for i in range(self.MAX_PARTS):
            self.__create_core(i)
    
    def __create_core(self, index: int):
        part = self.__create_data(index)
        try:
            response = requests.post(f"{SCHEMA}://{HOST}:{PORT}/api/parts", json=part, headers=HEADERS)
            part_data = response.json()
            self.part_ids.append(part_data["id"])
            print(f"Part successfully created: {part}")
        except Exception as e:
            print(f"Part failed to create: {part}, Error: {e}")
            raise
    
    def __create_data(self, index: int):
        fill = int(math.log10(self.MAX_PARTS) + 1)
        name: str
        for i in range(0, len(self.__PREFIXES)):
            if ((index % (i + 1)) == 0):
                name = f"Python {self.__PREFIXES[i + 1]} Part {str(index + 1).zfill(fill)}"
                break
    
        return {
            "name": name
        }
