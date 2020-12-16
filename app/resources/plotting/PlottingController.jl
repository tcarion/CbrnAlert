module PlottingController

using PyCall
using Genie.Renderer.Html, Genie.Requests
using ComputeShapes


function plotshape()
  pushfirst!(PyVector(pyimport("sys")."path"), "/home/tcarion/WebApp/lib")
  rg = pyimport("readgrib")
  mp = pyimport("magicsplot")
  pyimport("importlib")."reload"(mp) #### TO BE REMOVED IN PRODUCTION
  mg_inst = mp.mPlotter("out")

  index_keys = ["date", "time", "shortName", "level", "step"]
  reader = rg.GribReader("/home/tcarion/grib_files/20171201_to_20171231_tigge.grib", index_keys)
  keys_to_select = Dict(
    "date" => postpayload(:select_date),
    "step" => postpayload(:select_step),
    "time" => postpayload(:select_time),
    "level"=> reader.idx_get("level")[1],
    "shortName" => reader.idx_get("shortName")[1]
  )
  #println(keys_to_select)
  reader.idx_select(keys_to_select)
  reader.new_handle()

  lat = parse(Float64, postpayload(:lat))
  lon = parse(Float64, postpayload(:lon))
  
  nearest = reader.find_nearest(lon, lat, 1)[1]
  nearest_lat = nearest["lat"]
  nearest_lon = nearest["lon"]
  u_wind = nearest["value"]

  keys_to_select["shortName"] = reader.idx_get("shortName")[2]
  reader.idx_select(keys_to_select)
  reader.new_handle()
  nearest = reader.find_nearest(lon, lat, 1)[1]
  v_wind = nearest["value"]

  speed = round(sqrt(u_wind^2 + v_wind^2), digits=2)
  resolution = 25
  if speed < 10
    circle_coord = ComputeShapes.ATP_circle(lat, lon, 10, resolution)
    mg_inst.add_input(circle_coord["longitudes"], circle_coord["latitudes"], "black")
  else
    alpha = atan(v_wind, u_wind) * 180 / pi
    tangents = ComputeShapes.ATP_tangents(lat, lon, 10., 2., alpha, resolution)
    mg_inst.add_input(tangents["top_line"]["longitudes"], tangents["top_line"]["latitudes"], "black")
    mg_inst.add_input(tangents["bot_line"]["longitudes"], tangents["bot_line"]["latitudes"], "black")
    edgelinelon = [tangents["top_line"]["longitudes"][end], tangents["bot_line"]["longitudes"][end]] 
    edgelinelat = [tangents["top_line"]["latitudes"][end], tangents["bot_line"]["latitudes"][end]] 
    mg_inst.add_input(edgelinelon, edgelinelat, "black")
  end

  grid = reader.get_coord()
  
  #mg_inst.add_input(circle_longitudes, circle_latitudes, "black")
  #mg_inst.add_input(circle_longitudes.+1, circle_latitudes, "red")
  total_area = [minimum(grid["longitudes"]), minimum(grid["latitudes"]), maximum(grid["longitudes"]), maximum(grid["latitudes"])]
  zoom_scale = 3
  zoom_area = [lon-zoom_scale, lat-zoom_scale, lon+zoom_scale, lat+zoom_scale]
  mg_inst.define_area(zoom_area)
  mg_inst.mplot()
  html(:plotting, "plotmap.jl.html", layout=:app, speed=speed)
  #html(:readgrib, "initiateform.jl.html", layout=:app)

end

end
