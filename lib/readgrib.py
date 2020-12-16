import numpy as np
from eccodes import (codes_index_new_from_file, codes_index_get, codes_get,
                    codes_index_select, codes_new_from_index, codes_set,
                    codes_index_add_file, codes_get_array, codes_get_values,
                    codes_index_release, codes_release, codes_set_values,
                    codes_write, codes_grib_find_nearest)

class GribReader():
    def __init__(self, filename, index_keys):
        self.filename = filename
        self.index_keys = index_keys
        self.idx = codes_index_new_from_file(self.filename, index_keys)
        self.gid = None

    def idx_get(self, key):
        return codes_index_get(self.idx, key)
    
    def idx_select(self, keys_to_select):
        for k,v in keys_to_select.items():
            #print('codes_index_select({}, {}, {})'.format(self.idx, k, v))
            codes_index_select(self.idx, k, v)
    
    def new_handle(self):
        self.gid = codes_new_from_index(self.idx)
        if self.gid == None:
            raise Exception("GID IS NONE")

    def find_nearest(self, lon, lat, npoints):
        return codes_grib_find_nearest(self.gid, lat, lon, npoints=npoints)

    def get_coord(self):
        Nx = codes_get(self.gid, 'Nx') #numberOfPointsAlongAParallel
        #Ny = codes_get(self.gid, 'Ny') #numberOfPointsAlongAMeridian
        latit = codes_get_array(self.gid, 'latitudes')
        longit = codes_get_array(self.gid, 'longitudes')
        latit = latit[0::Nx]
        longit = longit[0:Nx]
        return {"longitudes" : longit, "latitudes" : latit}
    