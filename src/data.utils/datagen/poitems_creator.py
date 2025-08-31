import random
import requests
from core import HEADERS, HOST, PORT, SCHEMA

class POItemCreator:
    __poid: str
    __partids: list[str]

    def __init__(self, poid: str, partids: list[str]):
        self.__poid = poid
        self.__partids = partids

    def create(self):
        total = len(self.__partids)
        start = random.randint(1, int(total / 10))
        stop = random.randint(start, total)

        for i in range(start, stop):
            self.__create_core(i)
    
    def __create_core(self, index: int):
        poitem = self.__create_data(index)
        try:
            requests.post(f"{SCHEMA}://{HOST}:{PORT}/api/poitems", json=poitem, headers=HEADERS)
            print(f"PO item successfully created: {poitem}")
        except Exception as e:
            print(f"PO item failed to create: {poitem}, Error: {e}")
            raise
    
    def __create_data(self, index: int):
        return {
            "poid": self.__poid,
            "count": random.randint(1, 100),
            "partid": self.__partids[index]
        }
