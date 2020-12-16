import Magics.macro as mg
import numpy as np
  
class mPlotter():

  #def __init__(self, output):
  
  def __init__(self, output):
    self.actions = []
    self.output = mg.output(   
      output_formats = ['svg'],
      output_name = "public/img/" + output,
      output_name_first_page_number = "off",
      output_width = 800,
    )

    self.page = mg.page(
      page_id_line = "off",
      layout='positional',
      super_page_x_length = 12.,
      super_page_y_length = 11.,
      page_x_length=99.,
      page_y_length=25.,
      # page_x_position=15.,
      # page_y_position=10.5,
      subpage_x_position=0.5,
      subpage_y_position=0.5,
      subpage_x_length=29.,
      subpage_y_length=10.,
      # subpage_vertical_axis_width=0.5,
      # subpage_horizontal_axis_height=0.5,
    )

    europe = [-20, 70, 40, 5]

    default_area = europe
    proj_used = 'mercator'
    self.area = mg.mmap(subpage_map_projection=proj_used,
      subpage_lower_left_longitude=default_area[0],
      subpage_lower_left_latitude=default_area[1],
      subpage_upper_right_longitude=default_area[2],
      subpage_upper_right_latitude=default_area[3],
    )
    self.coast = mg.mcoast(
      map_user_layer = 'on',
      map_coastline_land_shade = 'on',
      map_coastline_land_shade_colour = 'cream',
      map_coastline_colour = 'grey',
      map_grid_colour = 'grey',
      map_grid_line_style = 'dash',
      map_label = "on",
      map_boundaries = "on",
      #map_cities = "on",
      #map_efas = "on",
      map_rivers = "on",
      map_user_layer_name = 'public/shapefiles/ocean/ne_10m_ocean',
      map_user_layer_colour = '#FB78FF'
    )

  def add_input(self, lon, lat, color):
    release_area_input = mg.minput(
      input_x_values    =    lon,
      input_y_values    =    lat
    )
    release_area_layout = mg.mgraph(
      graph_line_colour = color,
      graph_line_thickness = 3,
      graph_line_style     = 'solid'
    )
    self.actions.append(release_area_input)
    self.actions.append(release_area_layout)
    
  def define_area(self, proj, coords):
    self.area = mg.mmap(subpage_map_projection=proj,
      subpage_lower_left_longitude=coords[0],
      subpage_lower_left_latitude=coords[1],
      subpage_upper_right_longitude=coords[2],
      subpage_upper_right_latitude=coords[3],
    )
  def mplot(self):
    mg.plot(self.page, self.output, self.area, self.coast, self.actions)