module ATPController

using PyCall
using Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests
using ComputeShapes
using EarthCompute
using JSON
using Dates

const ec = EarthCompute
const LIB_PATH = joinpath(pwd(), "lib")
const MARS_PATH = "mars"
const DEFAULT_GRIB = "public/grib_files/2020-12-10_0000_europe.grib"
struct Wind
  u::Float64
  v::Float64
  speed::Float64
  Wind(u, v) = new(u, v, sqrt(u^2 + v^2))
end

"""
Structure to represent one ATP model instance. `shapes` contains all to shapes related to the ATP instance (release area, hazard area etc.). 
The other fields are data related to the instance
"""
struct ShapeData
  shapes::Vector{ComputeShapes.Shape}
  wind::Wind
  date::String
  time::String
  step::String
end

"""
    to_dict(arg::Union{Wind, ShapeData})

Convert the structures in dict to be passed to Genie.Renderer.Json.json
"""
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

"""
    steps_to_datetimes(toParse, steps::Union{Array{Int}, Tuple{Vararg}, Array{String}}, df)

Return an array of `DateTime` objects for each element in `steps`. `toParse` is parsed according to `df`
# Examples
```julia-repl
julia> steps_to_datetimes("19930212T12:00:00", [0, 3, 6], "yyyymmddTH:M:S")
3-element Array{DateTime,1}:
 1993-02-12T12:00:00
 1993-02-12T15:00:00
 1993-02-12T18:00:00
```
"""
function steps_to_datetimes(toParse, steps::Array{Int}, df)
  start_d = DateTime(toParse, df)
  return map(step -> start_d + Dates.Hour(step), steps)
end
steps_to_datetimes(toParse, steps::Tuple{Vararg}, df) = steps_to_datetimes(toParse, collect(steps), df)
steps_to_datetimes(toParse, steps::Array{String}, df) = steps_to_datetimes(toParse, map(x -> parse(Int, x), steps), df)

"""
    start_date(date, step[, df])

Return the date `step` hours before `date`. If `typeof(date)` is a string, a format must be provided as `df`
"""
start_date(date::DateTime, step) :: DateTime = date - Dates.Hour(step)
start_date(date::String, step) :: DateTime = start_date(DateTime(date), step)
start_date(date::String, step, df::String) :: DateTime = start_date(DateTime(date, DateFormat(df)), step)

"""
    preloaded_data()
Generate the page for working with data preloaded on the server.
The file from which information are collected is given in `payload()[:file]`. If no `payload()[:file]` default file is loaded.
Data sent for html parsing :
  @`datetimes` Array{Dict{Symbol,String},1} with 2 fields:
    :datetime => forecast step in a datetime form
    :step => step of the forecast
  @`files` grib files available on the server
  @`loaded_file` path of the file from which data have to be loaded
"""
function preloaded_data()
  pypath = PyVector(pyimport("sys")."path")
  if !(LIB_PATH in pypath) pushfirst!(pypath, LIB_PATH) end
  rg = pyimport("readgrib")

  if haskey(payload(), :file)
    grib_to_read = "public/grib_files/" * payload()[:file] * ".grib"
  else
    grib_to_read = DEFAULT_GRIB
  end

  keys = ["date", "time", "shortName", "level", "step"]
  reader = rg.GribReader(grib_to_read, keys)

  date = reader.idx_get("date")[1]
  time = reader.idx_get("time")[1]
  steps = reader.idx_get("step")

  steps = sort(map(x -> parse(Int, x), collect(steps)))

  time = time == "0" ? "0000" : time
  m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
  time = !isnothing(m) ? m[:h]*":"*m[:m] : error("time is in unreadable format")

  available_datetimes = steps_to_datetimes(date*"T"*time, steps, "yyyymmddTH:M")
  available_datetimes_str = map(x -> Dates.format(x, "yyyy-mm-ddTHH:MM:SS"), available_datetimes)
  available_time = [Dict(:datetime => x, :step => y) for (x, y) in zip(available_datetimes_str, steps)]

  searchdir(path,key) = filter(x->occursin(key,x), readdir(path))
  grib_files = searchdir(joinpath(pwd(), "public", "grib_files"),".grib")
  grib_files = map(x -> split(x, ".")[1], grib_files)

  html(:atp, "loaded_data.jl.html",
    datetimes = available_time, files=grib_files, loaded_file=grib_to_read, 
    layout=:app)
end

"""
    archive_data()
Generate the page for chosing date and time for archive data retrieval.
No data sent for html parsing
"""
function archive_data()
  html(:atp, "archive_data.jl.html")
end

"""
    atp_shape_request()
Handle a request for an ATP hazard prediction. Interpolate the wind speed at the requested lon/lat with the four nearest points.
Then calculate the ATP shapes according to the wind speed and return a Dict with the prediction data.

Needed from json request :
  @`lat`, @`lon`, @`date`, @`time`, @`step`
  @`loaded_file` file to get the data from
Data sent for html parsing :
  @`shape_data` 
"""
function atp_shape_request()
  pypath = PyVector(pyimport("sys")."path")
  if !(LIB_PATH in pypath) pushfirst!(pypath, LIB_PATH) end
  rg = pyimport("readgrib")
  ajax_received = jsonpayload()
  
  lat = typeof(ajax_received["lat"]) == String ? parse(Float64, ajax_received["lat"]) : ajax_received["lat"]
  lon = typeof(ajax_received["lon"]) == String ? parse(Float64, ajax_received["lon"]) : ajax_received["lon"]
  keys = ["date", "time", "shortName", "level", "step"]

  grib_to_read = ajax_received["loaded_file"]
  reader = rg.GribReader(grib_to_read, keys)

  datetime_start = start_date(ajax_received["date"]*ajax_received["time"], ajax_received["step"], "yyyy-mm-ddHH:MM:SS")
  date = Dates.format(datetime_start, "yyyymmdd")
  time = Dates.format(datetime_start, "HHMM")
  time = time == "0000" ? "0" : time

  keys_to_select = Dict(
    "date" => date,
    "step" => ajax_received["step"],
    "time" => time,
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

  return to_dict(shape_data) |> Genie.Renderer.Json.json
end


"""
    archive_request()
Send a mars request for archive data with the requested date, time and area

Needed from json request :
  @`date_request`, @`times_request`
"""
function archive_request()
  archive_keys = jsonpayload()
  area = "europe"

  date = archive_keys["date_request"]
  time = archive_keys["times_request"]
  time = match(r"(\d+):(\d+)", time)[1]*match(r"(\d+):(\d+)", time)[2]
  req = """retrieve,
    type    = fc,
    date    = $date,
    time    = $time,
    step    = 0/6/12/18/24/30/36,
    levtype = sfc,
    param   = 10u/10v,
    area    = $area,
    grid    = 2.5/2.5,    
    target  = "public/grib_files/$(date)_$(time)_$(area).grib
    """

  run(pipeline(`echo $req`, `$MARS_PATH`))
end

end
