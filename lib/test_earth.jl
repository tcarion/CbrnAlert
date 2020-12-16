### A Pluto.jl notebook ###
# v0.12.16

using Markdown
using InteractiveUtils

# ╔═╡ ac0ab32c-39f5-11eb-0e99-95990532f71e
push!(LOAD_PATH, "/home/tcarion/WebApp/lib/")

# ╔═╡ 0677af08-39f4-11eb-2023-43d0b70b8dc9
begin
	using Revise
	using EarthCompute
	using ComputeShapes
	using Plots
end

# ╔═╡ c7af40de-3a1a-11eb-13ee-7d33201f1991
include("interp_tests.jl")

# ╔═╡ aab1e5c0-39f9-11eb-3530-31306287f0ac
plotly()

# ╔═╡ ccd13cf2-39fa-11eb-0e9a-7fb281ee16e8
begin
	ec = EarthCompute
	cs = ComputeShapes
end

# ╔═╡ ccb4ff72-39fe-11eb-3077-0114e4e2954d
begin
	lat = 10.2
	lon = 100.8
	impact_point = ec.SphereC(lon*pi/180, lat*pi/180)
	impact_stereo = ec.sphere_to_stereo(impact_point)
end

# ╔═╡ 3386df98-39fa-11eb-16b4-21a689ce060b
begin
	circ = cs.ATP_circle(lat, lon, 1000, 25)
	sph = ec.SphereC(circ.lon * pi / 180, circ.lat * pi / 180)
	cart = ec.sphere_to_cart(sph)
	stereo = ec.cart_to_stereo(cart)
end

# ╔═╡ 99fffb6a-3b99-11eb-20da-613305931b83
begin
	tri = cs.ATP_triangle(lat, lon, 10, 2, 1, 1)
	tri_sph = ec.SphereC(tri.lon*pi/180, tri.lat*pi/180)
	dist = ec.GC_distance(tri_sph.phi[1], tri_sph.theta[1], tri_sph.phi[2], tri_sph.theta[2])
end

# ╔═╡ 092bfdd6-3a1b-11eb-010d-c7daca00cb81
surroundings = near(lon, lat)

# ╔═╡ 6be074f2-3a1b-11eb-297f-9fec2035c7e1
begin
	near_lon = [d["lon"] for d in surroundings]
	near_lat = [d["lat"] for d in surroundings]
	near_u = [d["value"] for d in surroundings]
	nearest_coords_sph = ec.SphereC(near_lon*pi/180, near_lat*pi/180)
	ncoords_stereo = ec.sphere_to_stereo(nearest_coords_sph)
end

# ╔═╡ 8af578fa-3acd-11eb-0ffb-fb0f510599d3
begin
	N = 5;
	x = range(minimum(ncoords_stereo.x), stop=maximum(ncoords_stereo.x), length=N);
	y = range(minimum(ncoords_stereo.y), stop=maximum(ncoords_stereo.y), length=N);
	Xg = x * ones(N)';
	Yg = ones(N) * y';
	N
end

# ╔═╡ 3709a96a-3aed-11eb-1842-abf315e46c36
coefs = ec.poly_bilinear_interp(nearest_coords_sph, near_u)

# ╔═╡ 1d307392-3ad5-11eb-04b0-b3d7f606a69a
begin 
	grid = [ones(N)*ones(N)', Xg, Yg, Xg.*Yg]
	U = sum(grid .* coefs)
	u_impact = ec.evaluate_interp(impact_point, coefs)
end

# ╔═╡ 31ed610c-3ad8-11eb-094c-874b3ece29b0
begin 
	interp_plot = surface(Xg, Yg, U)
	plot!(interp_plot, ncoords_stereo, near_u)
	plot!(interp_plot, impact_stereo, u_impact)
end

# ╔═╡ 88d790bc-3ae4-11eb-28b5-8d0960f761e3
typeof(u_impact) == Float64 ? ([impact_stereo.x], [impact_stereo.y], [u_impact]) : (impact_stereo.x, impact_stereo.y, u_impact)

# ╔═╡ 5e606afe-3a0b-11eb-3701-e73fed7a5aad
begin
	earth_coords = ec.earth_coord()
	earth = surface(earth_coords, alpha=0.5, legend=false)
	ec.plot!(earth, nearest_coords_sph)
	ec.plot!(earth, impact_point)
	ec.plot!(earth, tri_sph)
	ec.plot!(earth, tri_mid)
	#ec.plot!(earth, ec.sphere_to_stereo(nearest_coords_sph))
	#ec.plot!(earth, ec.sphere_to_stereo(impact_point))
end

# ╔═╡ Cell order:
# ╠═ac0ab32c-39f5-11eb-0e99-95990532f71e
# ╠═0677af08-39f4-11eb-2023-43d0b70b8dc9
# ╠═c7af40de-3a1a-11eb-13ee-7d33201f1991
# ╠═aab1e5c0-39f9-11eb-3530-31306287f0ac
# ╠═ccd13cf2-39fa-11eb-0e9a-7fb281ee16e8
# ╠═ccb4ff72-39fe-11eb-3077-0114e4e2954d
# ╠═3386df98-39fa-11eb-16b4-21a689ce060b
# ╠═99fffb6a-3b99-11eb-20da-613305931b83
# ╠═092bfdd6-3a1b-11eb-010d-c7daca00cb81
# ╠═6be074f2-3a1b-11eb-297f-9fec2035c7e1
# ╠═8af578fa-3acd-11eb-0ffb-fb0f510599d3
# ╠═3709a96a-3aed-11eb-1842-abf315e46c36
# ╠═1d307392-3ad5-11eb-04b0-b3d7f606a69a
# ╠═31ed610c-3ad8-11eb-094c-874b3ece29b0
# ╠═88d790bc-3ae4-11eb-28b5-8d0960f761e3
# ╠═5e606afe-3a0b-11eb-3701-e73fed7a5aad
