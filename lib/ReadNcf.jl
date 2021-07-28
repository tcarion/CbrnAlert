module ReadNcf
using NetCDF
using Dates
using GeoJSON
using GeoInterface
using ColorSchemes
using Colors

DEFAULT_COLOR_SCHEME = ColorSchemes.jet

file = "/home/tcarion/CBRN-dispersion-app/public/flexpart_runs/20210607_00_20210607_12_3000/output/grid_conc_20210607000000.nc"
function get_field(file::String, n::Integer)
    lat = ncread(file, "latitude"); lon = ncread(file, "longitude"); spec = ncread(file, "spec001_mr");
    z = spec[:,:,1,n,1,1]
    lon, lat, z
end

function get_filtered_field(file, n)
    lon, lat, z = get_field(file, n)
    mask = (!).(isapprox.(0., z))

    mg_lon = lon .* ones(length(lat))'
    mg_lat = lat' .* ones(length(lon))

    return mg_lon[mask], mg_lat[mask], z[mask]
end

function ncfmetadata(file)
    times = convert.(Int, ncread(file, "time") ./ 3600)
    startdatetime = Dates.DateTime(ncgetatt(file, "Global", "ibdate")*ncgetatt(file, "Global", "ibtime"), dateformat"yyyymmddHHMMSS")
    enddatetime = Dates.DateTime(ncgetatt(file, "Global", "iedate")*ncgetatt(file, "Global", "ietime"), dateformat"yyyymmddHHMMSS")
    lats = ncread(file, "latitude");
    lons = ncread(file, "longitude");
    min_lon = minimum(lons)
    max_lon = maximum(lons)
    rellon = ncread(file, "RELLNG1")
    rellat = ncread(file, "RELLAT1")
    if min_lon > 180 || max_lon > 180
        min_lon -= 360
        max_lon -= 360
    end
    if min_lon < -180 || max_lon < -180
        min_lon += 360
        max_lon += 360
    end
    area = [maximum(lats), min_lon, minimum(lats), max_lon]

    dx = round(lons[2] - lons[1], digits=3)
    dy = round(lats[2] - lats[1], digits=3)

    return Dict(
        :times => times,
        :startDate => startdatetime,
        :endDate => enddatetime,
        :heights => ncread(file, "height"),
        :dx => dx,
        :dy => dy,
        :releaseLons => rellon,
        :releaseLats => rellat,
        :area => area
    )
end

function frame_coord(lon, lat, dx, dy)
    dx2 = dx/2
    dy2 = dy/2

    left = lon - dx2; right = lon + dx2; lower = lat - dy2; upper = lat + dy2

    return [
        [left, lower],
        [left, upper],
        [right, upper],
        [right, lower],
    ]
end

function fields2cells(lons, lats, conc, dx, dy)
    # lons, lats, conc = get_filtered_field(file, n)
    colors, cbar, ticks_label = val2colors_trunc(conc)
    # dx, dy = Flexpart.deltamesh(lons, lats)

    framed = Dict(
        "legendData" => Dict(
            "colorbar" => cbar,
            "ticksLabel" => ticks_label
        ),
        "cells" => Array{Dict, 1}()
    )
    for (i, c) in enumerate(conc)
        push!(framed["cells"], Dict(
            :corners => frame_coord(lons[i], lats[i], dx, dy),
            :center => [lons[i], lats[i]],
            :conc => c,
            :color => colors[i]
            )
        )
    end
    framed
end

function frame2geojson(framed)
    geocells = Array{FeatureCollection, 1}()

    for cell in framed["cells"]
        features = [
            Feature(
                Polygon([cell[:corners]]),
                Dict(
                    "conc" => cell[:conc],
                    "color" => cell[:color]
                )
            ),
            # Feature(
            #     Point(cell[:center])
            # )
        ]
        push!(geocells, FeatureCollection(features))
    end

    geocells, framed["legendData"]
end

function colorbar(z, n = 10)
    logz = log10.(z)
    scheme = DEFAULT_COLOR_SCHEME
    minlogz = minimum(logz); maxlogz = maximum(logz)

    ticks = range(minlogz, maxlogz, length=n+1) |> collect
    ticks_label = 10 .^ ticks
    cbar = get(scheme, ticks[2:end], :extrema)

    "#".*hex.(cbar), ticks_label
end
# function colorbar(file::String, n = 10)
#     lons, lats, conc = get_filtered_field(file, n)
#     @show conc
#     cbar, ticks_label = colorbar(conc, n)

#     return "#".*hex.(cbar), ticks_label
# end

# function val2colors(z)
#     logz = log10.(z)

#     # t = normz .- minimum(normz)
#     # rescaled_normz = t ./ maximum(t)

#     scheme = DEFAULT_COLOR_SCHEME

#     cbar = get(scheme, logz, :extrema)
#     # carray = [hex(get(scheme, v)) for v in rescaled_normz]
#     carray = "#".*hex.(cbar)
#     return carray
# end

function val2colors_trunc(z, n = 10)
    cbar, ticks_label = colorbar(z, n)

    trunc_colors = Array{String, 1}()

    for v in z
        which_cat = v .< ticks_label
        i = findfirst(which_cat)
        i = i == 1 ? 2 : i
        i = isnothing(i) ? length(ticks_label) : i
        push!(trunc_colors, cbar[i-1])
    end

    carray = trunc_colors
    return carray, cbar, ticks_label
end

end