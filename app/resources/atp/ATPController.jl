module ATPController

using PyCall
using Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests
using ComputeShapes
using EarthCompute
using JSON
using Dates
import Genie.Router: @params

const ec = EarthCompute
const LIB_PATH = joinpath(pwd(), "lib")

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

function steps_to_datetimes(start_date, start_time, steps::Array{Int})
  df = DateFormat("yyyymmddHH:MM:SS")
  inc = steps[2:end] - steps[1:end-1]
  start_d = DateTime(start_date*start_time, df)
  datetimes = accumulate((date, step) -> date + Dates.Hour(step), inc, init=start_d)
  return [start_d, datetimes...]
end
steps_to_datetimes(start_date, start_time, steps::Tuple{Vararg}) = steps_to_datetimes(start_date, start_time, collect(steps))
steps_to_datetimes(start_date, start_time, steps::Array{String}) = steps_to_datetimes(start_date, start_time, map(x -> parse(Int, x), steps))

function preloaded_data()
  pypath = PyVector(pyimport("sys")."path")
  if !(LIB_PATH in pypath) pushfirst!(pypath, LIB_PATH) end
  rg = pyimport("readgrib")

  if haskey(payload(), :file)
    grib_to_read = "public/grib_files/" * payload()[:file] * ".grib"
  else
    grib_to_read = "/home/tcarion/grib_files/20171201_to_20171231_tigge.grib"
  end

  keys = ["date", "time", "shortName", "level", "step"]
  if isfile(grib_to_read)
    reader = rg.GribReader(grib_to_read, keys)
  else
    reader = rg.GribReader("/home/tcarion/grib_files/20171201_to_20171231_tigge.grib", keys)
  end

  dates = reader.idx_get("date")
  times = reader.idx_get("time")
  steps = reader.idx_get("step")
  steps = sort(map(x -> parse(Int, x), collect(steps)))

  searchdir(path,key) = filter(x->occursin(key,x), readdir(path))
  grib_files = searchdir(joinpath(pwd(), "public", "grib_files"),".grib")
  grib_files = map(x -> split(x, ".")[1], grib_files)

  available_datetimes = steps_to_datetimes(dates[1], times[1], steps)
  @show dates[1]
  @show available_datetimes[1]
  available_datetimes_str = map(x -> Dates.format(x, "yyyy-mm-ddTHH:MM"), available_datetimes)
  @show available_datetimes_str
  html(:atp, "loaded_data.jl.html", 
    datetimes = available_datetimes_str, files=grib_files, loaded_file=grib_to_read, 
    layout=:app)

  #html(:plotting, "plotmap.jl.html", layout=:app, speed=speed)
  #html(:readgrib, "initiateform.jl.html", layout=:app)

end

function archive_data()
  html(:atp, "archive_data.jl.html")
end

function shape_coord_request()
  pypath = PyVector(pyimport("sys")."path")
  if !(LIB_PATH in pypath) pushfirst!(pypath, LIB_PATH) end
  rg = pyimport("readgrib")
  ajax_received = jsonpayload()
  
  lat = typeof(ajax_received["lat"]) == String ? parse(Float64, ajax_received["lat"]) : ajax_received["lat"]
  lon = typeof(ajax_received["lon"]) == String ? parse(Float64, ajax_received["lon"]) : ajax_received["lon"]
  keys = ["date", "time", "shortName", "level", "step"]

  grib_to_read = ajax_received["loaded_file"]

  reader = rg.GribReader(grib_to_read, keys)

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
  
  open("public/grib_files/request.txt", "w") do file
    JSON.print(file, archive_keys)
  end

  run_script_cmd = `lib/web_request.py`
  run(run_script_cmd)
  
end

end
