import sys
sys.path.insert(0,'/home/tcarion/CBRN-dispersion-app/lib/')

import readgrib

path = '/home/tcarion/CBRN-dispersion-app/public/grib_files/2017-12-11_1200_europe.grib'
index_keys = ['date', 'time', 'shortName', 'level', 'step']

reader = readgrib.GribReader(path, index_keys)

date = reader.idx_get("date")[0]
time = reader.idx_get("time")[0]
steps = reader.idx_get("step")
level = reader.idx_get("level")[0]
shortname = reader.idx_get("shortName")[0]
keys_to_select = {
    "date": date,
    "time": time,
    "level": level,
    "shortName": shortname,
    "step": steps[0]
}

reader.idx_select(keys_to_select)

reader.new_handle()

print(reader.get_area())