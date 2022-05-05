module ComputeShapes

using GeoInterface
const earthRad = 6371.0

mutable struct Shape
	lons::Vector{Float64}
	lats::Vector{Float64}
	type::String
	label::String
	Shape(lon, lat, type) = new(lon, lat, type, "")
end

function to_coords(lons::Array{Float64, 1}, lats::Array{Float64, 1})
	return [[e[1], e[2]] for e in zip(lons, lats)]
end

# function to_coords(s::Shape)
# 	return to_coords(s.lons, s.lats)
# end

function get_lonlat(g::AbstractPolygon)
	coords = coordinates(g)
	lons = [e[1] for e in coords[1]]
	lats = [e[2] for e in coords[1]]
	lons, lats
end

function get_lonlat(g::AbstractLineString)
	coords = coordinates(g)
	lons = [e[1] for e in coords]
	lats = [e[2] for e in coords]
	lons, lats
end

function get_lonlat(f::AbstractFeature)
	get_lonlat(f.geometry)
end


function to_dict(s::Shape)
	d = Dict()
	for fn in fieldnames(typeof(s))
		push!(d, fn => getfield(s, fn))
	end
	return d
end

function ATP_circle(lat, lon, radius, resolution)::Feature
	radDis = radius / earthRad
	rLat = lat * pi / 180
	rLon = lon * pi / 180

	latVal = (pi / 2 - radDis) * ones(resolution)'
	
	theta = pi / 2 - lat * pi / 180

    rotation_y = x -> [
        cos.(x) 0 sin.(x)
        0  1 0
        -sin.(x) 0 cos.(x)
        ]
	
	latL = []
	lonL = []

    lonVal = [0:resolution-1;]' * 2 * pi / resolution
	north_coord = [
        cos.(latVal) .* cos.(lonVal)
        cos.(latVal) .* sin.(lonVal)
        sin.(latVal)
        ]

	rotated_coor = rotation_y(theta) * north_coord

	lonL = atan.(rotated_coor[2, :], rotated_coor[1, :]) * 180 / pi
	latL = asin.(rotated_coor[3, :]) * 180 / pi

    lonL = lonL .+ lon

	append!(lonL, lonL[1])
	append!(latL, latL[1])

	polygon = Polygon(to_coords(lonL, latL))
	properties = Dict(
		"shape" => "circle"
	)
	return Feature(polygon, properties)
end

function ATP_line(lat, lon, line_length, we_comp, sn_comp, resolution)::Feature
	# step = range(0, stop=line_length, length=resolution)

	norm = sqrt(we_comp^2 + sn_comp^2)

	lonL = [lon, lon + line_length / (earthRad * cos(lat * pi / 180)) * 180 / pi * we_comp / norm]
	latL = [lat, lat + line_length / earthRad * 180 / pi * sn_comp / norm]

	linestring = LineString(to_coords(lonL, latL))
	properties = Dict(
		"shape" => "line"
	)
	return Feature(linestring, properties)
end

function ATP_line_angle(lat, lon, line_length, alpha)::Feature

	lonL = [lon, lon + line_length / (earthRad * cos(lat * pi / 180)) * 180 / pi * cos(alpha * pi / 180)]
	latL = [lat, lat + line_length / earthRad * 180 / pi * sin(alpha * pi / 180)]

	linestring = LineString(to_coords(lonL, latL))
	properties = Dict(
		"shape" => "line"
	)

	return Feature(linestring, properties)
end

function ATP_triangle(lat_center, lon_center, length_line, radius, alpha)::Feature
	out_circle = ATP_line_angle(lat_center, lon_center, 2 * radius, alpha + 180.)
	lons, lats = get_lonlat(out_circle)
	lon_start = lons[end]
	lat_start = lats[end]

	hyp_length = (length_line + 2 * radius) / (sqrt(3) / 2)
	top_line = ATP_line_angle(lat_start, lon_start, hyp_length, alpha + 30.)
	bot_line = ATP_line_angle(lat_start, lon_start, hyp_length, alpha - 30.)
	# lonL = [lon_start, get_lonlat(top_line)[1][], bot_line.lons[2]]
	# latL = [lat_start, top_line.lats[2], bot_line.lats[2]]
	# last_line = LineString([coordinates(top_line.geometry)[2], coordinates(bot_line.geometry)[2]])
	polygon = Polygon([coordinates(top_line.geometry)[1], coordinates(top_line.geometry)[2], coordinates(bot_line.geometry)[2]])
	properties = Dict(
		"shape" => "triangle"
	)
	return Feature(polygon, properties)
end

function ATP_triangle(lat_center, lon_center, length_line, radius, x_comp, y_comp)::Feature
	alpha = atan(y_comp, x_comp) * 180 / pi
	return ATP_triangle(lat_center, lon_center, length_line, radius, alpha)
end

end



