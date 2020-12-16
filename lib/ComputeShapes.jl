module ComputeShapes

const earthRad = 6371.0

mutable struct Shape
	lon::Vector{Float64}
	lat::Vector{Float64}
	type::String
	label::String
	Shape(lon, lat, type) = new(lon, lat, type, "")
end

function to_coords(s::Shape)
	return [[e[1], e[2]] for e in zip(s.lat, s.lon)]
end

function to_dict(s::Shape)
	d = Dict()
	for fn in fieldnames(typeof(s))
		push!(d, fn => getfield(s, fn))
	end
	return d
end

function ATP_circle(lat, lon, radius, resolution)
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

    return Shape(lonL, latL, "circle")
end

function ATP_line(lat, lon, line_length, we_comp, sn_comp, resolution)
	step = range(0, stop=line_length, length=resolution)

	norm = sqrt(we_comp^2 + sn_comp^2)

	lonL = [lon, lon + line_length / (earthRad * cos(lat * pi / 180)) * 180 / pi * we_comp / norm]
	latL = [lat, lat + line_length / earthRad * 180 / pi * sn_comp / norm]
	return Shape(lonL, latL, "line")
end

function ATP_line_angle(lat, lon, line_length, alpha)

	lonL = [lon, lon + line_length / (earthRad * cos(lat * pi / 180)) * 180 / pi * cos(alpha * pi / 180)]
	latL = [lat, lat + line_length / earthRad * 180 / pi * sin(alpha * pi / 180)]
	return Shape(lonL, latL, "line")
end

function ATP_triangle(lat_center, lon_center, length_line, radius, alpha)
	out_circle = ATP_line_angle(lat_center, lon_center, 2 * radius, alpha + 180.)
	lon_start = out_circle.lon[end]
	lat_start = out_circle.lat[end]

	hyp_length = (length_line + 2 * radius) / (sqrt(3) / 2)
	top_line = ATP_line_angle(lat_start, lon_start, hyp_length, alpha + 30.)
	bot_line = ATP_line_angle(lat_start, lon_start, hyp_length, alpha - 30.)
	lonL = [lon_start, top_line.lon[2], bot_line.lon[2]]
	latL = [lat_start, top_line.lat[2], bot_line.lat[2]]
	return Shape(lonL, latL, "triangle")
end

function ATP_triangle(lat_center, lon_center, length_line, radius, x_comp, y_comp)
	alpha = atan(y_comp, x_comp) * 180 / pi
	return ATP_triangle(lat_center, lon_center, length_line, radius, alpha)
end

end



