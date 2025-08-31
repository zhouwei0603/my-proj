import math
import requests
from core import HEADERS, HOST, PORT, SCHEMA
from poitems_creator import POItemCreator

class POCreator:
    MAX_POS = 5000

    __MONTHS = {
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

    __partids: list[str]

    def __init__(self, partids: list[str]):
        self.__partids = partids

    def create(self):
        for i in range(self.MAX_POS):
            self.__create_core(i)
    
    def __create_core(self, index: int):
        po = self.__create_data(index)
        try:
            response = requests.post(f"{SCHEMA}://{HOST}:{PORT}/api/pos", json=po, headers=HEADERS)
            po_data = response.json()
            poitem_creator = POItemCreator(po_data["id"], self.__partids)
            poitem_creator.create()
            print(f"PO successfully created: {po}")
        except Exception as e:
            print(f"PO failed to create: {po}, Error: {e}")
            raise
    
    def __create_data(self, index: int):
        fill = int(math.log10(self.MAX_POS) + 1)
        title: str
        for i in range(0, len(self.__MONTHS)):
            if ((index % (i + 1)) == 0):
                title = f"Python {self.__MONTHS[i + 1]} PO title {str(index + 1).zfill(fill)}"
                break
    
        return {
            "title": title
        }
