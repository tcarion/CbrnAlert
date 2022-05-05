module ReadGrib
using GRIB

export find_nearest_wind, get_area, get_key_values
# filename = "/home/tcarion/CBRN-dispersion-app/public/grib_files/2021-02-24_0000_54--5-47-14.grib"
# filename = "/home/tcarion/CBRN-dispersion-app/public/grib_files/2021-02-12_1200_60--28-36-47.grib"
KEYS = ["date", "time", "level", "step"]

struct OutOfBoundAreaError <: Exception
    lon::Number
    lat::Number
end

struct KeysNotFoundError <: Exception 
    keys::Dict
end

Base.showerror(io::IO, e::OutOfBoundAreaError) = print(io, "lon=$(e.lon) and lat=$(e.lat) are out of the dataset area")
Base.showerror(io::IO, e::KeysNotFoundError) = print(io, "the following key set couldn't be selected : $(e.keys)")
function find_nearest_wind(file, keys_to_select, lon, lat)
    nearest_winds = Dict()
    area = get_area(file)
    if (lon < area[2] || lon > area[4] || lat < area[3] || lat > area[1])
        throw(OutOfBoundAreaError(lon, lat))
    end

    Index(file, KEYS...) do index
        for (key, val) in keys_to_select
            select!(index, key, val)
        end
        for msg in index
            Nearest(msg) do near
                lons, lats, values = find(near, msg, lon, lat)
                surroundings = Dict(
                    :lon => lons,
                    :lat => lats,
                    :values => values
                )
                push!(nearest_winds, msg["shortName"] => surroundings)
            end
        end
    end

    if isempty(nearest_winds)
        throw(KeysNotFoundError(keys_to_select))
    end
    return nearest_winds
end

function get_area(file)
    GribFile(file) do reader
        m = Message(reader)
        lons, lats = data(m)
        min_lon = minimum(lons)
        max_lon = maximum(lons)
        if min_lon > 180 || max_lon > 180
            min_lon -= 360
            max_lon -= 360
        end
        if min_lon < -180 || max_lon < -180
            min_lon += 360
            max_lon += 360
        end
        return [maximum(lats), min_lon, minimum(lats), max_lon]
    end
end

function get_key_values(file::String, key::String)
    key_values = Vector()
    GribFile(file) do reader
        for msg in reader
            push!(key_values, string(msg[key]))
        end
    end
    return unique(key_values)
end

# keys_to_select = Dict(
#     "date" => "20210224",
#     "step" => "0",
#     "time" => "0",
#     "level" => "0"
# )


# find_nearest_wind("/home/tcarion/CBRN-dispersion-app/public/grib_files/2021-02-24_0000_54--5-47-14.grib", keys_to_select, 4, 50)


# reader = GribFile(filename)

# m = Message(reader)

# Ny = m["Ny"]
# lons, lats, values = data(m)
# Ntot = length(lons)
# Nx = Ntot/Ny
# keylist = Vector{String}()
# for key in keys(m)
#     push!(keylist, key)
# end

# keys_to_select = ["date", "time", "shortName", "level", "step"]
# index = Index(filename, keys_to_select...)

# select!(index, "shortName", "10u")

# destroy(reader)
end