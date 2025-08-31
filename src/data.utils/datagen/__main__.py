from pos_creator import POCreator
from parts_creator import PartCreator

parts_creator = PartCreator()
parts_creator.create()

po_creator = POCreator(parts_creator.part_ids)
po_creator.create()