module ATPController

# using PyCall
using Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests, Genie.Assets, Genie.Renderer
using ComputeShapes
using EarthCompute
using ReadGrib
using JSON
using Dates
using Sockets
using UUIDs
using GenieAuthentication
import Genie.Exceptions.ExceptionalResponse
# using Router

before() =  authenticated() || throw(ExceptionalResponse(redirect(:show_login)))

const ec = EarthCompute
const LIB_PATH = joinpath(pwd(), "lib")
const MARS_PATH = "mars"
const DEFAULT_GRIB = "public/grib_files/2021-01-04_1200_europe.grib"
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

struct MarsRequest
  date::String
  time::String
  step::String
  area::String
  target_file::String
  datetime::DateTime
end
MarsRequest(date, time, step, area::Array) = MarsRequest(date, time, step, join(area, "/"))
MarsRequest(date, time, step, area::String) = MarsRequest(date, time, step, area,  "public/grib_files/$(date)_$(time)_$(replace(area, "/" => "-")).grib", DateTime(date*time, dateformat"yyyymmddHHMM"))

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
steps_to_datetimes(start_d::DateTime, steps::Array{Int}) = map(step -> start_d + Dates.Hour(step), steps)

"""
    start_date(date, step[, df])

Return the date `step` hours before `date`. If `typeof(date)` is a string, a format must be provided as `df`
"""
start_date(date::DateTime, step) :: DateTime = date - Dates.Hour(step)
start_date(date::String, step) :: DateTime = start_date(DateTime(date), step)
start_date(date::String, step, df::String) :: DateTime = start_date(DateTime(date, DateFormat(df)), step)


request_to_string(date, time, step, area, target_file = "public/grib_files/$(date)_$(time)_$(replace(area, "/" => "-")).grib") = """retrieve,
                                      type    = fc,
                                      date    = $date,
                                      time    = $time,
                                      step    = $step,
                                      levtype = sfc,
                                      param   = 10u/10v,
                                      area    = $area,
                                      target  = "$target_file"
                                      """
                                      
request_to_string(req::MarsRequest) = request_to_string(req.date, req.time, req.step, req.area, req.target_file)

searchdir(path,key) = filter(x->occursin(key,x), readdir(path))

wrap_coord(lon, lat) = [ceil(Int, lat)+1, floor(Int, lon)-1, floor(Int, lat)-1, ceil(Int, lon)+1]

function broadcast_mars_output(req::MarsRequest, channel_info)
  str_req = request_to_string(req)
  cmd = pipeline(`echo $str_req`, `mars`)
#   cmd = `./test/sleeping_script.sh`
  process = open(cmd)
  while !eof(process)
    try
      info_to_send = Dict(:displayed => readline(process), :userfb_id => channel_info["userfb_id"])
      Genie.WebChannels.broadcast(channel_info["channel"], info_to_send)
    catch e
      println("COULDN'T BROADCAST TO WEBCHANNEL")
      throw(e)
    end
  end
end

"""
    preloaded_atp_prediction()
Generate the page with the map to make atp prediction requests either by clicking on the map or by manually picking the coordinates.
The file from which information are collected is given in `payload()[:file]`. If no `payload()[:file]` default file is loaded.
Data sent for html parsing :
  @`datetimes` Array{Dict{Symbol,String},1} with 2 fields:
    :datetime => forecast step in a datetime form
    :step => step of the forecast
  @`files` grib files available on the server
  @`loaded_file` path of the file from which data have to be loaded
"""
function preloaded_atp_prediction()

  if haskey(payload(), :file)
    grib_to_read = "public/grib_files/" * payload()[:file] * ".grib"
  else
    grib_files = searchdir(joinpath(pwd(), "public", "grib_files"),".grib")
    if isempty(grib_files)
      return html(:atp, "loaded_data_not_found.jl.html", layout=:app)
    else
      grib_to_read = joinpath(pwd(), "public", "grib_files", grib_files[1])
    end
  end

  date = ReadGrib.get_key_values(grib_to_read, "date")[1]
  time = ReadGrib.get_key_values(grib_to_read, "time")[1]
  steps = ReadGrib.get_key_values(grib_to_read, "step")

  steps = typeof(steps[1]) != Int ? sort(map(x -> parse(Int, x), collect(steps))) : sort(collect(steps))

  time = (time == "0" || time == 0) ? "0000" : string(time)
  m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
  time = !isnothing(m) ? m[:h]*":"*m[:m] : error("time is in unreadable format")

  available_datetimes = steps_to_datetimes(date*"T"*time, steps, "yyyymmddTH:M")
  available_datetimes_str = map(x -> Dates.format(x, "yyyy-mm-dd @ HH:MM:SS"), available_datetimes)
  available_time = [Dict(:datetime => x, :step => y) for (x, y) in zip(available_datetimes_str, steps)]

  grib_files = searchdir(joinpath(pwd(), "public", "grib_files"),".grib")
  grib_files = map(x -> split(x, ".")[1], grib_files)

  loaded_data_info = Dict(
    :date => Dates.format(available_datetimes[1], "Y-mm-dd"), 
    :time => Dates.format(available_datetimes[1], "HH:MM"),
    :hour_nbr => steps[end],
    :filename => split(grib_to_read, '/')[end],
    :area => round.(ReadGrib.get_area(grib_to_read), digits=3)
    )

  html(:atp, "loaded_data.jl.html",
    datetimes = available_time, files=grib_files, loaded_file=grib_to_read, loaded_data_info = loaded_data_info,
    layout=:app)
end

function realtime_atp_prediction()
  today = Dates.today()
  today_midnight = Dates.DateTime(today)
  today_noon = today_midnight + Dates.Hour(12)
  yesterday_noon = today_midnight - Dates.Hour(12)
  if Dates.now() > Dates.DateTime(Dates.year(today), Dates.month(today), Dates.day(today), 18, 55)
    start_date = today_noon
  elseif Dates.now() > Dates.DateTime(Dates.year(today), Dates.month(today), Dates.day(today), 6, 55)
    start_date = today_midnight
  else
    start_date = yesterday_noon
  end

  steps =  collect(0:6:240)
  available_dt = steps_to_datetimes(start_date, steps)
  available_dt_str = map(x -> Dates.format(x, "yyyy-mm-dd @ HH:MM:SS"), available_dt)
  available_time_dict = [Dict(:datetime => x, :step => y) for (x, y) in zip(available_dt_str, steps)]
  channels_js_script = Assets.channels_support("$(uuid4())")

  html(:atp, "realtime_data.jl.html", datetimes = available_time_dict, channels_js_script = channels_js_script, layout=:app)
end

"""
    archive_data()
Generate the page for chosing date and time for archive data retrieval.
No data sent for html parsing
"""
function archive_data()
  channels_js_script = Assets.channels_support("$(uuid4())")

  html(:atp, "archive_data.jl.html", channels_js_script = channels_js_script, layout=:app)
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
  request_data = jsonpayload()
  
  lat = typeof(request_data["lat"]) == String ? parse(Float64, request_data["lat"]) : request_data["lat"]
  lon = typeof(request_data["lon"]) == String ? parse(Float64, request_data["lon"]) : request_data["lon"]

  step = request_data["step"]
  datetime_start = start_date(request_data["date"]*request_data["time"], step, "yyyy-mm-ddHH:MM:SS")
  date = Dates.format(datetime_start, "yyyymmdd")
  time = Dates.format(datetime_start, "HHMM")
  
  grib_to_read = haskey(request_data, "loaded_file") ? request_data["loaded_file"] : ""
  
  area = request_data["area"]
  
  if grib_to_read != ""
    filename = grib_to_read
  else

    req = MarsRequest(date, time, step, wrap_coord(lon, lat))
    channel_info = request_data["channel_info"]
    for n_attempts in 1:2
      broadcast_mars_output(req, channel_info)
      if isfile(req.target_file)
        filename = req.target_file
        break
      else
        prev_date = DateTime(req.date*req.time, dateformat"yyyymmddHHMM")
        new_date = prev_date - Dates.Hour(12)
        new_step = parse(Int, req.step) + 12
        req = MarsRequest(Dates.format(new_date, "yyyymmdd"), Dates.format(new_date, "HHMM"), string(new_step), req.area)
      end
    end
    
    if !isfile(req.target_file)
        throw(Genie.Exceptions.RuntimeException("Mars request not completed", "The grib file hasn't been found", 1))
    end
    
    date = req.date
    time = req.time
    step = req.step
  end
  
  time = time == "0000" ? "0" : time
  
  keys_to_select = Dict(
    "date" => date,
    "step" => step,
    "time" => time,
    "level"=> "0",
  )
  
  surroundings = Dict()
  try 
    surroundings = ReadGrib.find_nearest_wind(filename, keys_to_select, lon, lat)
  catch e
    if isa(e, ReadGrib.OutOfBoundAreaError)
        throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 1))
    elseif isa(e, ReadGrib.KeysNotFoundError)
        throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 1))
    else
        throw(e)
    end
  end

  nearest_phi = surroundings["10u"][:lon] .* pi/180
  nearest_theta =  surroundings["10u"][:lat] .* pi/180
  nearest_coord= ec.SphereC(nearest_phi, nearest_theta)
  
  nearest_u = surroundings["10u"][:values]
  nearest_v = surroundings["10v"][:values]
  
  u_wind = ec.evaluate_interp(lon * pi/180, lat * pi/180, ec.poly_bilinear_interp(nearest_coord, nearest_u))
  v_wind = ec.evaluate_interp(lon * pi/180, lat * pi/180, ec.poly_bilinear_interp(nearest_coord, nearest_v))

  wind = Wind(u_wind, v_wind)

  shape_data = ShapeData(Vector{ComputeShapes.Shape}(), wind, date, time, step)

  resolution = 25
  thres_wind = 10 / 3.6
  if wind.speed < thres_wind
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

  if grib_to_read == "" rm(req.target_file) end
    
  return to_dict(shape_data) |> Genie.Renderer.Json.json
end


"""
    mars_request()
Send a mars request for archive data with the requested date, time and area

Needed from json request :
  @`date_request`, @`times_request`
"""
function mars_request()
  archive_keys = jsonpayload()

  area = archive_keys["area"]

  if haskey(archive_keys, "date") && haskey(archive_keys, "time")
    date = archive_keys["date"]
    time = archive_keys["time"]
  else
    today = Dates.now()
    date = Dates(today, "yyyy-mm-dd")
    # time = Dates.format(today, "HH:MM")
    time = "00:00"
  end
  
  time = match(r"(\d+):(\d+)", time)[1]*match(r"(\d+):(\d+)", time)[2]
<<<<<<< HEAD
=======
#   @show archive_keys
#   @show date
#   @show time 
#   req = request_to_string(date, time, join(collect(0:6:240), "/"), area)
>>>>>>> da19e898c0f3e3355786c732cb5474e41315fec5
  req = MarsRequest(replace(date, "-" => ""), time, join(collect(0:6:240), "/"), area)

  try
    channel_info = archive_keys["channel_info"]
    broadcast_mars_output(req, channel_info)
  catch e
    if isa(e, ProcessFailedException)
        throw(Genie.Exceptions.RuntimeException("$(e)", "Error in mars, probably because the forecast is not available yet", 1))
    else
        throw(e)
    end
  end
end

end
