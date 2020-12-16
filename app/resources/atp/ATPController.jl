module ATPController

using PyCall
using Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests
using ComputeShapes
using EarthCompute
using JSON
import Genie.Router: @params

const ec = EarthCompute

struct Wind
  u::Float64
  v::Float64
  speed::Float64
  Wind(u, v) = new(u, v, sqrt(u^2 + v^2))
end

struct ShapeData
  shapes::Vector{ComputeShapes.Shape}
  wind::Wind
  date::String
  time::String
  step::String
end

function to_dict(w::Wind)
	d = Dict()
	for fn in fieldnames(typeof(w))
		push!(d, fn => getfield(w, fn))
	end
	return d
end

function to_dict(sd::ShapeData)
	d = Dict()
  for fn in fieldnames(typeof(sd))
    if fn == :shapes
      list_of_dict = []
      for shape in getfield(sd, fn)
        push!(list_of_dict, shape |> ComputeShapes.to_dict)
      end
      push!(d, fn => list_of_dict)
    elseif fn == :wind
      push!(d, fn => getfield(sd, fn) |> to_dict)
    else
      push!(d, fn => getfield(sd, fn))
    end
	end
	return d
end

function preloaded_data()
  pypath = PyVector(pyimport("sys")."path")
  if !("/home/tcarion/WebApp/lib" in pypath) pushfirst!(pypath, "/home/tcarion/WebApp/lib") end
  rg = pyimport("readgrib")

  if haskey(payload(), :file)
    grib_to_read = "public/grib_files/" * payload()[:file] * ".grib"
  else
    grib_to_read = "/home/tcarion/grib_files/20171201_to_20171231_tigge.grib"
  end

  keys_to_select = ["date", "time", "shortName", "level", "step"]
  if isfile(grib_to_read)
    reader = rg.GribReader(grib_to_read, keys_to_select)
  else
    reader = rg.GribReader("/home/tcarion/grib_files/20171201_to_20171231_tigge.grib", keys_to_select)
  end

  dates = reader.idx_get("date")
  times = reader.idx_get("time")
  steps = reader.idx_get("step")
  
  searchdir(path,key) = filter(x->occursin(key,x), readdir(path))
  grib_files = searchdir(pwd() * "/public/grib_files",".grib")
  grib_files = map(x -> split(x, ".")[1], grib_files)

  html(:atp, "loaded_data.jl.html", 
    dates = dates, times=times, steps=steps, files=grib_files, loaded_file=grib_to_read, 
    layout=:app)

  #html(:plotting, "plotmap.jl.html", layout=:app, speed=speed)
  #html(:readgrib, "initiateform.jl.html", layout=:app)

end

function archive_data()
  html(:atp, "archive_data.jl.html")
end

function shape_coord_request()
  pypath = PyVector(pyimport("sys")."path")
  if !("/home/tcarion/WebApp/lib" in pypath) pushfirst!(pypath, "/home/tcarion/WebApp/lib") end
  rg = pyimport("readgrib")
  ajax_received = jsonpayload()
  
  lat = typeof(ajax_received["lat"]) == String ? parse(Float64, ajax_received["lat"]) : ajax_received["lat"]
  lon = typeof(ajax_received["lon"]) == String ? parse(Float64, ajax_received["lon"]) : ajax_received["lon"]
  keys_to_select = ["date", "time", "shortName", "level", "step"]

  grib_to_read = ajax_received["loaded_file"]
  @show grib_to_read
  reader = rg.GribReader(grib_to_read, keys_to_select)

  keys_to_select = Dict(
    "date" => ajax_received["date"],
    "step" => ajax_received["step"],
    "time" => ajax_received["time"],
    "level"=> reader.idx_get("level")[1],
    "shortName" => reader.idx_get("shortName")[1]
  )

  reader.idx_select(keys_to_select)
  reader.new_handle()
  
  surroundings = reader.find_nearest(lon, lat, 4)
  nearest_phi = [d["lon"] for d in surroundings] * pi/180
	nearest_theta = [d["lat"] for d in surroundings] * pi/180
  nearest_coord= ec.SphereC(nearest_phi, nearest_theta)
  
	nearest_u = [d["value"] for d in surroundings]
  u_wind = ec.evaluate_interp(lon * pi/180, lat * pi/180, ec.poly_bilinear_interp(nearest_coord, nearest_u))

  keys_to_select["shortName"] = reader.idx_get("shortName")[2]
  reader.idx_select(keys_to_select)
  reader.new_handle()
  surroundings = reader.find_nearest(lon, lat, 4)

  nearest_v = [d["value"] for d in surroundings]
  v_wind = ec.evaluate_interp(lon * pi/180, lat * pi/180, ec.poly_bilinear_interp(nearest_coord, nearest_v))

  wind = Wind(u_wind, v_wind)

  shape_data = ShapeData(Vector{ComputeShapes.Shape}(), wind, ajax_received["date"], ajax_received["time"], ajax_received["step"])

  resolution = 25
  if wind.speed < 10
    haz_area = ComputeShapes.ATP_circle(lat, lon, 10., resolution)
    haz_area.label = "Hazard Area"
    rel_area = ComputeShapes.ATP_circle(lat, lon, 2., resolution)
    rel_area.label = "Release Area"
    push!(shape_data.shapes, haz_area)
    push!(shape_data.shapes, rel_area)
  else
    haz_area = ComputeShapes.ATP_triangle(lat, lon, 10., 2., wind.u, wind.v)
    haz_area.label = "Hazard Area"
    rel_area = ComputeShapes.ATP_circle(lat, lon, 2., resolution)
    rel_area.label = "Release Area"
    push!(shape_data.shapes, haz_area)
    push!(shape_data.shapes, rel_area)
  end

  requested_data = to_dict(shape_data)

  #### FOR LOGGING PURPOSE - TO BE REMOVED
  #push!(requested_data, "nearest_u" => nearest_u)
  #push!(requested_data, "nearest_v" => nearest_v)
  ####
  return requested_data |> Genie.Renderer.Json.json
end

function archive_request()
  archive_keys = jsonpayload()

  pypath = PyVector(pyimport("sys")."path")
  if !("/home/tcarion/WebApp/lib" in pypath) pushfirst!(pypath, "/home/tcarion/WebApp/lib") end
  
  # println(archive_keys)
  open("public/grib_files/request.txt", "w") do file
    JSON.print(file, archive_keys)
  end

  run_script_cmd = `/home/tcarion/mars_requests/web_request.py`
  run(run_script_cmd)
  # py"""
  # with open("test.txt", "w") as f:
  #   print(archive_keys, file=f)
  # """(archive_keys)
  # @pywith pybuiltin("open")("public/grib_files/request.txt","w") as f begin
  #   print(archive_keys, file=f)
  # end

  # api_req = pyimport("ecmwfrequest")
  # pyimport("importlib")."reload"(api_req)

  # server = api_req.ApiServer()
  # server.build_request(archive_keys["date_from"], archive_keys["date_to"], archive_keys["steps"], archive_keys["times"], "60/-30/-20/40")

  # #println(server.req)
  # server.send_request()
  
end

end
