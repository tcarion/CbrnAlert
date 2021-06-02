module ReadNcf
using NetCDF
using Dates
using GeoJSON
file = "/home/tcarion/CBRN-dispersion-app/public/flexpart_runs/20210524_00_20210524_12_1000/output/grid_conc_20210524000000.nc"
function get_field(file, n)
    lat = ncread(file, "latitude");
    lon = ncread(file, "longitude");
    spec = ncread(file, "spec001_mr");

    return lon, lat, spec[:,:,1,n,1,1]
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
        :area => area
    )
end

function frame_coord(lon, lat, dx, dy)
    dx2 = dx/2
    dy2 = dy/2

    left = lon - dx2
    right = lon + dx2
    lower = lat - dy2
    upper = lat + dy2

    return [
        [left, lower],
        [left, upper],
        [right, upper],
        [right, lower],
    ]
end

function framed_conc(file, n, dx, dy)
    lons, lats, conc = get_filtered_field(file, n)
    framed = Array{Dict, 1}()
    for (i, c) in enumerate(conc)
        push!(framed, Dict(
            :corners => frame_coord(lons[i], lats[i], dx, dy),
            :center => [lons[i], lats[i]],
            :conc => c
            )
        )
    end
    framed
end

function frame2geo_dict(framed)
    feature_collection = Array{Dict, 1}()

    for cell in framed
        push!(feature_collection, 
            Dict(
                "type" => "FeatureCollection",
                "features" => [
                    Dict(
                        "type" => "Feature",
                        "geometry" => Dict(
                            "type" => "Polygon",
                            "coordinates" => [cell[:corners]]
                        ),
                        "properties" => Dict(
                            "conc" => cell[:conc]
                        )
                    ),
                    Dict(
                        "type" => "Feature",
                        "geometry" => Dict(
                            "type" => "Point",
                            "coordinates" => cell[:center]
                        )
                    ),
                ]
            )
        )
    end

    feature_collection
end

end