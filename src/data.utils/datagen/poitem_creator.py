import random
import requests
from core import DATA_HEADERS, DATA_HOST, DATA_PORT, DATA_SCHEMA

class POItemCreator:
    def __init__(self, poid: str, partids: list[str]):
        self._poid = poid
        self._partids = partids

    def create(self):
        # Create a random number of PO items for the PO.

        total = len(self._partids)
        start = random.randint(1, int(total / 10))
        stop = random.randint(start, total)

        indices = [i for i in range(start, stop, 5)]

        print(f"Creating {len(indices)} PO items of PO {self._poid}")

        for i in indices:
            self._create_core(i)

        print(f"Created {len(indices)} PO items of PO {self._poid}")
    
    def _create_core(self, index: int):
        poitem = self._create_data(index)
        try:
            requests.post(f"{DATA_SCHEMA}://{DATA_HOST}:{DATA_PORT}/api/poitems", json=poitem, headers=DATA_HEADERS)
        except Exception as e:
            print(f"PO item failed to create: {poitem}, Error: {e}")
            raise
    
    def _create_data(self, index: int):
        return {
            "poid": self._poid,
            "count": random.randint(1, 100),
            "partid": self._partids[index]
        }
