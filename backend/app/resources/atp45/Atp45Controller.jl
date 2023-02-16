module Atp45Controller

using Genie
using Genie.Requests
using Genie.Renderer.Json: json
using Dates
using CbrnAlertApp.ReadGrib
using EcRequests
using ATP45
using GRIB
using JSON3

using GeoInterface
using GeoJSON
using DataStructures: OrderedDict

using CbrnAlertApp.Users
using CbrnAlertApp: TMP_DIR_PATH

const AVAILABLE_STEPS = 0:6:240

struct MarsRequest
    date::String
    time::String
    step::Array{Int64,1}
    area::String
    target_file::String
    datetime::DateTime
end
MarsRequest(date, time, step, area::Array) = MarsRequest(date, time, step, join(area, "/"))
MarsRequest(date, time, step, area::String) = MarsRequest(date, time, step, area,  "public/grib_files/$(date)_$(time)_$(replace(area, "/" => "-")).grib", DateTime(date * time, "yyyymmddHHMM"))

request_to_string(date, time, step, area, target_file="public/grib_files/$(date)_$(time)_$(replace(area, "/" => "-")).grib") = """retrieve,
                                      type    = fc,
                                      date    = $date,
                                      time    = $time,
                                      step    = $(join(step, "/")),
                                      levtype = sfc,
                                      param   = 10u/10v,
                                      area    = $area,
                                      target  = "$target_file"
                                      """
                                      
request_to_string(req::MarsRequest) = request_to_string(req.date, req.time, req.step, req.area, req.target_file)

searchdir(path,key) = filter(x -> occursin(key, x), readdir(path))

wrap_coord(lon, lat) = [ceil(Int, lat) + 1, floor(Int, lon) - 1, floor(Int, lat) - 1, ceil(Int, lon) + 1]

function broadcast_mars_output(req::MarsRequest, ws_info)
    str_req = request_to_string(req)
    cmd = pipeline(`echo $str_req`, `mars`)
    # cmd = `./test/sleeping_script.sh`
    process = open(cmd)
    while !eof(process)
        r = readline(process)
        info_to_send = Dict(:displayed => r, :backid => ws_info["backid"])
        Genie.WebChannels.broadcast(ws_info["channel"], "atp45" ,info_to_send)
        # try
        # catch e
        #     println("COULDN'T BROADCAST TO WEBCHANNEL")
        #     throw(e)
        # end
    end
    if process.processes[2].exitcode == 1
        throw(ProcessFailedException(process.processes[2]))
    end
    close(process)
end

function get_tree()
    json(
        ATP45.decision_tree(typedict = true)
    )
end

function post_run()
    payload = Genie.Requests.jsonpayload()
    runtype = Genie.Router.params(:weathertype, "manually")

    categories = payload["categories"]
    locations = payload["locations"]
    releases = ReleaseLocation(_parse_locations(locations))

    weather_inputs = if runtype == "manually"
        _manual_weather_inputs(payload)
    elseif runtype == "forecast"
        _forecast_weather_inputs(payload)
    elseif runtype == "archive"
        error("not implemented yes")
    else
        error("Wrong parameter")
    end
    result = run_atp(categories..., weather_inputs..., releases)
    response = Dict(
        :collection => geo2dict(result),
        :metadata => Dict(:meta => "test")
    )
    response |> json
end

function _forecast_weather_inputs(payload)
    locations = payload["locations"]
    lon, lat = locations[1].lon, locations[1].lat 

    input_collection = []
    weather = get(payload, "weatherInput", nothing)
    isnothing(weather) && (return input_collection)

    forecasttime = DateTime(weather["start"])
    leadtime = DateTime(weather["leadtime"])

    step_number = Dates.Hour(leadtime - forecasttime).value
    fc_req = default_request()
    target = joinpath(TMP_DIR_PATH, "tmp.grib")

    # We retrieve a bounding box because I experienced MARS errors when taking too small areas
    fc_req[:area] = join([ceil(Int, lat) + 1, floor(Int, lon) - 1, floor(Int, lat) - 1, ceil(Int, lon) + 1], "/")
    fc_req[:target] = target
    fc_req[:step] = string(step_number)

    fc_req_s = Dict(string(k)=>v for (k,v) in fc_req)

    # Retrieval of the meteorological data with MARS
    EcRequests.runmars(fc_req_s)

    # Retrieve the 4 nearest points from the input location by reading the grib file `target`
    nearests = Dict()
    GribFile(target, mode="r") do grib
        for message in grib
            Nearest(message) do near
                nearests[message["shortName"]] = find(near, message, lon, lat)
            end
        end
    end

    # From the 4 nearest points, we take the first (nearest neigbour interpolation)
    nearest = (
        # Coordinates of the nearest point to `lon`, `lat`
        lon = nearests["10u"][1][1],
        lat = nearests["10u"][2][1],
        # West to east horizontal wind component
        u = nearests["10u"][3][1],
        # south to north horizontal wind component
        v = nearests["10v"][3][1],
        # distance between the the nearest point and `lon`, `lat`
        distance = nearests["10u"][4][1],
    )

    @show nearest

    return [WindVector(nearest.u, nearest.v)]
end

function _manual_weather_inputs(payload)
    input_collection = []
    weather = get(payload, "weatherInput", nothing)
    isnothing(weather) && (return input_collection)

    wind_payload = get(weather, "wind", nothing)
    if !isnothing(wind_payload)
        wind = WindDirection(wind_payload.speed / 3.6, wind_payload.azimuth)
        push!(input_collection, wind)
    end

    stability_payload = get(weather, "stability", nothing)
    if !isnothing(stability_payload)
        stabilityClass = stability_payload.stabilityClass
        push!(input_collection, stabilityClass)
    end

    return input_collection
end

_parse_locations(locations) = [Float64.([loc.lon, loc.lat]) for loc in locations] 
"""
    mars_request()
Send a mars request for archive data with the requested date, time and area

Needed from json request :
  @`date_request`, @`times_request`
"""
function archive_retrieval(payload)
    request_data = payload
    
    area = request_data["area"]
    area = convert.(Int, round.(area))
    datetime_start = Dates.DateTime(request_data["datetime"][1:22])
    time = Dates.format(datetime_start, "HHMM")
    date = Dates.format(datetime_start, "yyyymmdd")
    req = MarsRequest(date, time, collect(0:6:240), area)
    
    # str_req = request_to_string(req)
    # cmd = pipeline(`echo $str_req`, `mars`)
    # run(cmd)

    try
        ws_info = request_data["ws_info"]
        broadcast_mars_output(req, ws_info)
    catch e
        if isa(e, ProcessFailedException)
            throw(Genie.Exceptions.RuntimeException("$(e)", "Error in mars, probably because the forecast is not available yet", 1))
        else
            throw(e)
        end
    end

    Genie.Cache.purge(:available_grib_files)
    return Dict(:res => "Retrieval done")
end


default_request() = OrderedDict(
    :type => "fc",
    :levtype => "sfc",
    :param => "10u/10v",
)


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
function steps_to_datetimes(toParse, steps, df)::DateTime[]
    start_d = DateTime(toParse, df)
    return map(step -> start_d + Dates.Hour(step), steps)
end
steps_to_datetimes(toParse, steps::Array{String}, df) = steps_to_datetimes(toParse, map(x -> Base.parse(Int, x), steps), df)
steps_to_datetimes(start_d::DateTime, steps) = map(step -> start_d + Dates.Hour(step), steps)


function available_steps()
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
  
    steps = AVAILABLE_STEPS
    leadtimes = steps_to_datetimes(start_date, steps)
  
    json(
        Dict(
            :start => start_date,
            :leadtimes => leadtimes
        )
    )
end

geo2dict(collection) = JSON3.read(GeoJSON.write(collection))

end