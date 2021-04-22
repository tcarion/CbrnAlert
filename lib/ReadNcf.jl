module ReadNcf
using NetCDF
using Dates
file = "/home/tcarion/CBRN-dispersion-app/public/flexpart_runs/20210330_01_20210330_10_1000/output/grid_conc_20210330010000.nc"
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

    return Dict(
        :times => times,
        :startdatetime => Dates.format(startdatetime, "yyyy-mm-ddTHHMMSS"),
        :enddatetime => Dates.format(enddatetime, "yyyy-mm-ddTHHMMSS"),
        :heights => ncread(file, "height"),
        :area => join(area, "/")
        )
end

end