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

global dict

const ec = 0
const WIND_THRESHOLD = 10 # km/h

global DEBUG_PAYLOAD_ATP = 0
debug() = global DEBUG_PAYLOAD_ATP = Genie.Requests.jsonpayload()

struct Wind
    u::Float64
    v::Float64
    speed::Float64
    Wind(u, v) = new(u, v, sqrt(u^2 + v^2))
end

# """
# Structure to represent one ATP model instance. `shapes` contains all to shapes related to the ATP instance (release area, hazard area etc.). 
# The other fields are data related to the instance
# """
# mutable struct ShapeData
#     lon::Float64
#     lat::Float64
#     # shapes::Vector{ComputeShapes.Shape}
#     shapes::Vector{Feature}
#     wind::Wind
#     datetime::DateTime
#     step::Int
# end

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

# """
#     to_dict(arg::Union{Wind, ShapeData})

# Convert the structures in dict to be passed to Genie.Renderer.Json.json
# """
# to_dict(field::Feature) = geo2dict(field)
# to_dict(field::Vector{Feature}) = geo2dict(FeatureCollection(field))
# to_dict(field) = field
# function type2dict(obj)
#     fns = fieldnames(obj |> typeof)
#     (!isempty(fns) && !isa(obj, DateTime)) ? Dict(fn => type2dict(getfield(obj, fn)) for fn in fieldnames(obj |> typeof)) : to_dict(obj)
# end

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

function available_steps(payload)
    filename = payload["filename"]
    grib_to_read = joinpath(pwd(), "public", "grib_files", filename * ".grib")

    if !isfile(grib_to_read)
        throw(Genie.Exceptions.RuntimeException("Available steps not retrived", "The grib file hasn't been found", 1))
    end

    date = ReadGrib.get_key_values(grib_to_read, "date")[1]
    time = ReadGrib.get_key_values(grib_to_read, "time")[1]
    steps = ReadGrib.get_key_values(grib_to_read, "step")

    steps = typeof(steps[1]) != Int ? sort(map(x -> Base.parse(Int, x), collect(steps))) : sort(collect(steps))

    time = (time == "0" || time == 0) ? "0000" : string(time)
    m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
    time = !isnothing(m) ? m[:h] * ":" * m[:m] : error("time is in unreadable format")
    startdate = DateTime(date * "T" * time, "yyyymmddTHH:MM")
    available_datetimes = steps_to_datetimes(startdate, steps)
    available_datetimes_str = map(x -> Dates.format(x, "yyyy-mm-ddTHH:MM:SS"), available_datetimes)
    available_steps = [Dict(:datetime => dt, :step => step) for (dt, step) in zip(available_datetimes_str, steps)]
    
    forecast = Dict(:startdate => Dates.format(startdate, "yyyy-mm-ddTHH:MM:SS"), :steps => available_steps)
    return forecast
end

function available_grib_files(payload)
    Genie.Cache.withcache(:available_grib_files) do
        grib_files = searchdir(joinpath(pwd(), "public", "grib_files"), ".grib")
        availabe_data = Array{Dict,1}()
        for f in grib_files
            grib_to_read = joinpath(pwd(), "public", "grib_files", f)
            date = ReadGrib.get_key_values(grib_to_read, "date")[1]
            time = ReadGrib.get_key_values(grib_to_read, "time")[1]
            steps = ReadGrib.get_key_values(grib_to_read, "step")

            steps = typeof(steps[1]) != Int ? sort(map(x -> Base.parse(Int, x), collect(steps))) : sort(collect(steps))
            time = (time == "0" || time == 0) ? "0000" : string(time)
            m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
            time = !isnothing(m) ? m[:h] * ":" * m[:m] : error("time is in unreadable format")

            start_date = Dates.DateTime(date * "T" * time, "yyyymmddTH:M")

            push!(availabe_data, Dict(
                :startDate => start_date,
                :duration => steps[end],
                :area => round.(ReadGrib.get_area(grib_to_read), digits=3),
                :filename => split(basename(grib_to_read), '.')[1]
            ))
        end
        return availabe_data
    end
end

# """
#     prediction_request()
# Handle a request for an ATP hazard prediction. Interpolate the wind speed at the requested lon/lat with the four nearest points.
# Then calculate the ATP shapes according to the wind speed and return a Dict with the prediction data.

# Needed from json request :
#   @`lat`, @`lon`, @`date`, @`time`, @`step`
#   @`loaded_file` file to get the data from
# Data return as json :
#   @`shape_data` 
# """
# function prediction_request(payload)
#     request_data = payload
#     lat = typeof(request_data["lat"]) == String ? Base.parse(Float64, request_data["lat"]) : request_data["lat"]
#     lon = typeof(request_data["lon"]) == String ? Base.parse(Float64, request_data["lon"]) : request_data["lon"]

#     step = request_data["step"] isa String ? Base.parse(Int64, request_data["step"]) : request_data["step"]

#     datetime_start = Dates.DateTime(request_data["datetime"][1:19])
#     time = Dates.format(datetime_start, "HHMM")
#     date = Dates.format(datetime_start, "yyyymmdd")

#     grib_to_read = request_data["loaded_file"]
#     filename = joinpath(pwd(), "public", "grib_files", grib_to_read * ".grib")

#     time_grib = time == "0000" ? "0" : time

#     keys_to_select = Dict(
#         "date" => date,
#         "step" => step,
#         "time" => time_grib,
#         "level" => "0",
#     )

#     run_dt = steps_to_datetimes(datetime_start, [step])[1]
#     shape_data = ShapeData(lon, lat, Vector{Feature}(), Wind(0, 0), run_dt, step)

#     shape_data = calc_prediction(filename, keys_to_select, shape_data)
#     dict_sd = shape_data |> type2dict

#     return dict_sd
# end

# function realtime_prediction_request(payload)
#     request_data = payload
#     lat = typeof(request_data["lat"]) == String ? Base.parse(Float64, request_data["lat"]) : request_data["lat"]
#     lon = typeof(request_data["lon"]) == String ? Base.parse(Float64, request_data["lon"]) : request_data["lon"]
#     step = request_data["step"]
#     datetime_start = Dates.DateTime(request_data["datetime"][1:22])
#     time = Dates.format(datetime_start, "HHMM")
#     date = Dates.format(datetime_start, "yyyymmdd")

#     req = MarsRequest(date, time, [step], wrap_coord(lon, lat))
#     ws_info = request_data["ws_info"]
#     for n_attempts in 1:2
#         broadcast_mars_output(req, ws_info)
#         if isfile(req.target_file)
#             filename = req.target_file
#             break
#         else
#             prev_date = DateTime(req.date * req.time, "yyyymmddHHMM")
#             new_date = prev_date - Dates.Hour(12)
#             new_step = Base.parse(Int, req.step) + 12
#             req = MarsRequest(Dates.format(new_date, "yyyymmdd"), Dates.format(new_date, "HHMM"), string(new_step), req.area)
#         end
#     end

#     if !isfile(req.target_file)
#         throw(Genie.Exceptions.RuntimeException("Mars request not completed", "The grib file hasn't been found", 1))
#     end
    
#     date = req.date
#     time = req.time
#     step = req.step[1]

#     filename = joinpath(pwd(), req.target_file)

#     time_grib = time == "0000" ? "0" : time
#     keys_to_select = Dict(
#         "date" => date,
#         "step" => step,
#         "time" => time_grib,
#         "level" => "0",
#     )

#     run_dt = steps_to_datetimes(datetime_start, [step])[1]
#     shape_data = ShapeData(lon, lat, Vector{Feature}(), Wind(0, 0), run_dt, step)

#     shape_data = calc_prediction(filename, keys_to_select, shape_data)

#     rm(filename)

#     dict_sd = shape_data |> type2dict
#     return dict_sd
# end

# function calc_prediction(filename, keys_to_select, shape_data::ShapeData)
#     lon = shape_data.lon
#     lat = shape_data.lat

#     surroundings = Dict()
#     try 
#         surroundings = ReadGrib.find_nearest_wind(filename, keys_to_select, lon, lat)
#     catch e
#         if isa(e, ReadGrib.OutOfBoundAreaError)
#             throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 500))
#         elseif isa(e, ReadGrib.KeysNotFoundError)
#             throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 500))
#         else
#             throw(e)
#         end
#     end

#     nearest_phi = surroundings["10u"][:lon] .* pi / 180
#     nearest_theta =  surroundings["10u"][:lat] .* pi / 180
#     nearest_coord = ec.SphereC(nearest_phi, nearest_theta)

#     nearest_u = surroundings["10u"][:values]
#     nearest_v = surroundings["10v"][:values]

#     u_wind = ec.evaluate_interp(lon * pi / 180, lat * pi / 180, ec.poly_bilinear_interp(nearest_coord, nearest_u))
#     v_wind = ec.evaluate_interp(lon * pi / 180, lat * pi / 180, ec.poly_bilinear_interp(nearest_coord, nearest_v))

#     wind = Wind(u_wind, v_wind)

#     shape_data.wind = wind

#     resolution = 25
#     thres_wind = WIND_THRESHOLD / 3.6
#     if wind.speed < thres_wind
#         haz_area = ComputeShapes.ATP_circle(lat, lon, 10., resolution)
#         rel_area = ComputeShapes.ATP_circle(lat, lon, 2., resolution)
#     else
#         haz_area = ComputeShapes.ATP_triangle(lat, lon, 10., 2., wind.u, wind.v)
#         rel_area = ComputeShapes.ATP_circle(lat, lon, 2., resolution)
        
#     end
#     push!(haz_area.properties, "label" => "Hazard Area")
#     push!(haz_area.properties, "color" => "	#0000FF")
#     push!(rel_area.properties, "label" => "Release Area")
#     push!(rel_area.properties, "color" => "	#FF0000")
#     push!(shape_data.shapes, haz_area)
#     push!(shape_data.shapes, rel_area)

#     push!(shape_data.shapes, Feature(Point([lon, lat]), Dict("type" => "releaseLocation")))
    
#     shape_data
# end

function get_tree()
    json(
        ATP45.ATP45_DICT_TREE
    )
end
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

const AVAILABLE_STEPS = collect(0:6:240)
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
function steps_to_datetimes(toParse, steps::AbstractArray{Int}, df)::DateTime[]
    start_d = DateTime(toParse, df)
    return map(step -> start_d + Dates.Hour(step), steps)
end
# steps_to_datetimes(toParse, steps::Tuple{Vararg}, df) = steps_to_datetimes(toParse, collect(steps), df)
steps_to_datetimes(toParse, steps::Array{String}, df) = steps_to_datetimes(toParse, map(x -> Base.parse(Int, x), steps), df)
steps_to_datetimes(start_d::DateTime, steps::Array{Int}) = map(step -> start_d + Dates.Hour(step), steps)


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


function run_wind()
    payload = Genie.Requests.jsonpayload()
    locations = payload["locations"]
    weather = payload["wind"]
    procedure = payload["procedureTypeId"]
    container = payload["containerId"]
    incident = payload["incidentTypeId"]

    stability = Symbol(payload["stabilityClass"])
    
    speed = weather["speed"]
    azimuth = weather["azimuth"]
    # speed = speed isa String ? Base.parse(Float64, speed) : Base.convert(Float64, speed) 
    # azimuth = azimuth isa String ? Base.parse(Float64, azimuth) : Base.convert(Float64, azimuth)
    cont_type = Symbol(container)
    proc_type = Symbol(procedure)
    inc_type = Symbol(incident)

    lon1 = locations[1]["lon"]
    lat1 = locations[1]["lat"]

    # lon1 = lon1 isa String ? Base.parse(Float64, lon1) : Base.convert(Float64, lon1) 
    # lat1 = lat1 isa String ? Base.parse(Float64, lat1) : Base.convert(Float64, lat1) 


    if length(locations) == 1
        input = Atp45Input([[lon1, lat1]], WindDirection(speed, azimuth), cont_type, proc_type, stability)
    elseif length(locations) > 1
        lon2 = locations[2]["lon"]
        lat2 = locations[2]["lat"]

        lon2 = lon2 isa String ? Base.parse(Float64, lon2) : Base.convert(Float64, lon2) 
        lat2 = lat2 isa String ? Base.parse(Float64, lat2) : Base.convert(Float64, lat2)

        input = Atp45Input([[lon1, lat1], [lon2, lat2]], WindDirection(speed, azimuth), cont_type, proc_type, stability)
    end


    if incident == "chem"
        atp45_result = ATP45.run_chem(input)
    elseif incident == "bio"
        atp45_result = ATP45.run_bio(input)
    #elseif incident == "radio"
     #   atp45_result = ATP45.run_radio(input)
    #elseif incident == "nucl"
     #   atp45_result = ATP45.run_nucl(input)
    end
    @show payload
    response = Dict(
        # Not ideal, should find a better way to parse the FeatureCollection
        :collection => JSON3.read(GeoJSON.write(atp45_result.collection)),
        :metadata => Dict(
            :cbrnTypes =>  Dict(
                :procedureType => Dict(
                    :id => proc_type,
                    :description => ATP45.PROCEDURES[proc_type][:name]
                ),
                :container => Dict(
                    :id => cont_type,
                    :description => ATP45.CONTAINERS[cont_type][:name]
                ),
                :incident => Dict(
                    :id => incident,
                    :description => ATP45.INCIDENTS[inc_type][:name]
                )
            ),
            :wind => Dict(
                :speed => atp45_result.input.wind.speed,
                :azimuth => atp45_result.input.wind.direction
            )
        )   
    )
    global DEBUG_PAYLOAD_ATP = response
    response |> json
end

function run_forecast()
    payload = Genie.Requests.jsonpayload()
    locations = payload["locations"]
    step = payload["step"]
    forecasttime = DateTime(step["start"])
    leadtime = DateTime(step["leadtime"])
    procedure = payload["procedureTypeId"]
    container = payload["containerId"]

    lon = locations[1]["lon"]
    lat = locations[1]["lat"]

    step = Dates.Hour(leadtime - forecasttime).value
    fc_req = default_request()

    target = "tmp.grib"
    fc_req[:date] = Dates.format(forecasttime, "yyyymmdd")
    fc_req[:time] = Dates.format(forecasttime, "HH")
    fc_req[:step] = string(step)
    # fc_req[:area] = join([lat, lon, lat, lon], "/")
    # fc_req[:area] = join([lat+.01, lon-.01, lat-.01, lon+.01], "/")

    # We retrieve a bounding box because I experienced MARS errors when taking too small areas
    fc_req[:area] = join([ceil(Int, lat) + 1, floor(Int, lon) - 1, floor(Int, lat) - 1, ceil(Int, lon) + 1], "/")
    fc_req[:target] = target

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
    nearest = Dict(
        # Coordinates of the nearest point to `lon`, `lat`
        :lon => nearests["10u"][1][1],
        :lat => nearests["10u"][2][1],
        # West to east horizontal wind component
        :u => nearests["10u"][3][1],
        # south to north horizontal wind component
        :v => nearests["10v"][3][1],
        # distance between the the nearest point and `lon`, `lat`
        :distance => nearests["10u"][4][1],
    )

    lon = locations[1]["lon"]
    lat = locations[1]["lat"]
    u = nearest[:u]
    v = nearest[:v]
    cont_type = Symbol(container)
    proc_type = Symbol(procedure)

    input = Atp45Input([[lon, lat]], WindCoords(u, v), cont_type, proc_type)
    atp45_result = ATP45.run(input)
    response = Dict(
        :collection => atp45_result.collection |> geo2dict,
        :metadata => Dict(
            :cbrnTypes =>  Dict(
                :procedureType => Dict(
                    :id => proc_type,
                    :description => ATP45.PROCEDURES[proc_type][:name]
                ),
                :container => Dict(
                    :id => cont_type,
                    :description => ATP45.CONTAINERS[cont_type][:name]
                )
            ),
            :wind => Dict(
                :speed => atp45_result.input.wind.speed,
                :azimuth => atp45_result.input.wind.azimuth
            )
        )
    )
    response |> json
    # Lancer l'ATP45.run à partir de la variable suivante dans laquelle tu as :u et :v comme données de vent. En gros
    # cette fonction doit retourner exactement pareil que run_wind. N'hésite pas à créer des fonctions supplémentaires
    # pour mettre en commun une partie du code et éviter le boilerplate (répétition de code "copier coller").
    # Pour faire tes tests, tu peux copier la ligne ci dessous dans le REPL et travailler à partir de la (évite de relancer
    # cette fonction à partir de l'interface graphique car elle doit faire appel à un serveur externe pour retrouver les données
    # météo)
    # nearest = Dict(:v => 0.0714569091796875, :lat => 50.931457353761914, :distance => 5.423612776114363, :u => -3.4767913818359375, :lon => 4.017857142857142)
end


function result(input)
    atp45_result = ATP45.run(input)
    response = Dict(
        :collection => atp45_result.collection |> geo2dict,
        :metadata => Dict(
            :cbrnTypes =>  Dict(
                :procedureType => Dict(
                    :id => proc_type,
                    :description => ATP45.PROCEDURES[proc_type][:name]
                ),
                :container => Dict(
                    :id => cont_type,
                    :description => ATP45.CONTAINERS[cont_type][:name]
                )
            ),
            :wind => Dict(
                :speed => atp45_result.input.wind.speed,
                :azimuth => atp45_result.input.wind.azimuth
            )
        )
    )
    response |> json
end


function get_container()
    containernames = keys(ATP45.CONTAINERS) |> collect
    descr = [x[2][:name] for x in ATP45.CONTAINERS]
 
    containers = [Dict(
        :id => x,
        :description => y
    ) for (x, y) in zip(containernames, descr)]

    return containers |> json
end

function get_procedure()
    type = keys(ATP45.PROCEDURES) |> collect
    descr = [x[2][:name] for x in ATP45.PROCEDURES]
    procedures = [Dict(
        :id => x,
        :description => y
    ) for (x, y) in zip(type, descr)]

    return procedures |> json
end

function get_incident()
    type = keys(ATP45.INCIDENTS) |> collect
    descr = [x[2][:name] for x in ATP45.INCIDENTS]
    incidents = [Dict(
        :id => x,
        :description => y
    ) for (x, y) in zip(type, descr)]

    return incidents |> json
end

geo2dict(collection) = JSON3.read(GeoJSON.write(collection))

end