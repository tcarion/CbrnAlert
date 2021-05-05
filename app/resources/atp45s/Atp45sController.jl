module Atp45sController

using Genie
using Genie.Requests
using Dates
using ReadGrib
using ComputeShapes
using EarthCompute

const ec = EarthCompute

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
steps_to_datetimes(start_d::DateTime, steps::Array{Int}) = map(step -> start_d + Dates.Hour(step), steps)

searchdir(path,key) = filter(x -> occursin(key, x), readdir(path))

function available_steps()
    payload = jsonpayload()
    filename = payload["filename"]
    grib_to_read = joinpath(pwd(), "public", "grib_files", filename*".grib")

    if !isfile(grib_to_read)
        throw(Genie.Exceptions.RuntimeException("Available steps not retrived", "The grib file hasn't been found", 1))
    end

    date = ReadGrib.get_key_values(grib_to_read, "date")[1]
    time = ReadGrib.get_key_values(grib_to_read, "time")[1]
    steps = ReadGrib.get_key_values(grib_to_read, "step")

    steps = typeof(steps[1]) != Int ? sort(map(x -> parse(Int, x), collect(steps))) : sort(collect(steps))

    time = (time == "0" || time == 0) ? "0000" : string(time)
    m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
    time = !isnothing(m) ? m[:h] * ":" * m[:m] : error("time is in unreadable format")
    available_datetimes = steps_to_datetimes(date * "T" * time, steps, "yyyymmddTH:M")
    available_datetimes_str = map(x -> Dates.format(x, "yyyy-mm-ddTHH:MM:SS"), available_datetimes)
    available_steps = [Dict(:datetime => dt, :step => step) for (dt, step) in zip(available_datetimes_str, steps)]
    Genie.Renderer.Json.json(available_steps)
end

function available_grib_files()
    grib_files = searchdir(joinpath(pwd(), "public", "grib_files"), ".grib")
    availabe_data = Array{Dict, 1}()
    for f in grib_files
        grib_to_read = joinpath(pwd(), "public", "grib_files", f)
        date = ReadGrib.get_key_values(grib_to_read, "date")[1]
        time = ReadGrib.get_key_values(grib_to_read, "time")[1]
        steps = ReadGrib.get_key_values(grib_to_read, "step")

        steps = typeof(steps[1]) != Int ? sort(map(x -> parse(Int, x), collect(steps))) : sort(collect(steps))
        time = (time == "0" || time == 0) ? "0000" : string(time)
        m = match(r"(?<h>\d{2}).?(?<m>\d{2})", time)
        time = !isnothing(m) ? m[:h] * ":" * m[:m] : error("time is in unreadable format")

        start_date = Dates.DateTime(date * "T" * time, "yyyymmddTH:M")

        push!(availabe_data, Dict(
            :startdate => start_date,
            :duration => steps[end],
            :area => round.(ReadGrib.get_area(grib_to_read), digits=3),
            :filename => split(basename(grib_to_read), '.')[1]
        ))
    end
    Genie.Renderer.Json.json(availabe_data)
end

"""
    prediction_request()
Handle a request for an ATP hazard prediction. Interpolate the wind speed at the requested lon/lat with the four nearest points.
Then calculate the ATP shapes according to the wind speed and return a Dict with the prediction data.

Needed from json request :
  @`lat`, @`lon`, @`date`, @`time`, @`step`
  @`loaded_file` file to get the data from
Data return as json :
  @`shape_data` 
"""
function prediction_request()
    request_data = jsonpayload()
    lat = typeof(request_data["lat"]) == String ? parse(Float64, request_data["lat"]) : request_data["lat"]
    lon = typeof(request_data["lon"]) == String ? parse(Float64, request_data["lon"]) : request_data["lon"]

    step = request_data["step"]

    datetime_start = Dates.DateTime(request_data["datetime"][1:22])
    time = Dates.format(datetime_start, "HHMM")
    date = Dates.format(datetime_start, "yyyymmdd")

    grib_to_read = haskey(request_data, "loaded_file") ? request_data["loaded_file"] : ""

    area = request_data["area"]
            
    filename = joinpath(pwd(), "public", "grib_files", grib_to_read * ".grib")

    time = time == "0000" ? "0" : time

    keys_to_select = Dict(
        "date" => date,
        "step" => step,
        "time" => time,
        "level" => "0",
    )

    surroundings = Dict()
    try 
    surroundings = ReadGrib.find_nearest_wind(filename, keys_to_select, lon, lat)
    catch e
        if isa(e, ReadGrib.OutOfBoundAreaError)
            throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 500))
        elseif isa(e, ReadGrib.KeysNotFoundError)
            throw(Genie.Exceptions.RuntimeException("$(e)", sprint(showerror, e), 500))
        else
            throw(e)
        end
    end

    nearest_phi = surroundings["10u"][:lon] .* pi / 180
    nearest_theta =  surroundings["10u"][:lat] .* pi / 180
    nearest_coord = ec.SphereC(nearest_phi, nearest_theta)

    nearest_u = surroundings["10u"][:values]
    nearest_v = surroundings["10v"][:values]

    u_wind = ec.evaluate_interp(lon * pi / 180, lat * pi / 180, ec.poly_bilinear_interp(nearest_coord, nearest_u))
    v_wind = ec.evaluate_interp(lon * pi / 180, lat * pi / 180, ec.poly_bilinear_interp(nearest_coord, nearest_v))

    wind = Wind(u_wind, v_wind)

    step = isa(step, Int) && string(step)
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

    return to_dict(shape_data) |> Genie.Renderer.Json.json
end

end