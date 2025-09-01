import math
import requests
from concurrent.futures import ThreadPoolExecutor, wait, ALL_COMPLETED
from core import HEADERS, HOST, PORT, SCHEMA
from poitem_creator import POItemCreator

class POCreator:
    _MONTHS = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    def __init__(self, partids: list[str], begin: int, end: int):
        self._partids = partids
        self._begin = begin
        self._end = end

    def create(self):
        print(f"Creating POs from {self._begin} to {self._end}")

        for i in range(self._begin, self._end + 1):
            self._create_core(i)

        print(f"Created POs from {self._begin} to {self._end}")
    
    def _create_core(self, index: int):
        po = self._create_data(index)
        try:
            response = requests.post(f"{SCHEMA}://{HOST}:{PORT}/api/pos", json=po, headers=HEADERS)
            po_data = response.json()

            print(f"Created PO {po_data["id"]}")

            poitem_creator = POItemCreator(po_data["id"], self._partids)
            poitem_creator.create()
        except Exception as e:
            print(f"PO failed to create: {po}, Error: {e}")
            raise

    def _create_data(self, index: int):
        fill = int(math.log10(self._end - self._begin + 1) + 1)
        title: str
        for i in range(0, len(POCreator._MONTHS)):
            if ((index % (i + 1)) == 0):
                title = f"Python {POCreator._MONTHS[i + 1]} PO title {str(index + 1).zfill(fill)}"
                break

        return {
            "title": title
        }

def _create():
    partids = _get_part_ids()

    arguments = list[tuple[int, int]]()

    # Create 2000 POs.
    for i in range(0, 20):
        begin = i * 100
        end = begin + 99
        arguments.append((begin, end))

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(_create_task, partids, arg[0], arg[1]) for arg in arguments]
        wait(futures, return_when=ALL_COMPLETED)

def _create_task(partids: list[str], begin: int, end: int):
    creator = POCreator(partids, begin, end)
    creator.create()

def _get_part_ids() -> list[str]:
    partids = list[str]()
    _fill_part_ids(partids, 0)
    return partids

def _fill_part_ids(partids: list[str], start: int):
    response = requests.get(f"{SCHEMA}://{HOST}:{PORT}/api/parts?start={start}&size={_PAGING_SIZE}", headers=HEADERS)
    json = response.json()

    parts = json["value"]
    partids.extend([part["id"] for part in parts])

    total: int = json["total"]
    if (len(partids) < total):
        _fill_part_ids(partids, start + _PAGING_SIZE)

_PAGING_SIZE = 100

if __name__ == "__main__":
    _create()
