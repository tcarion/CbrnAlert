module EarthCompute

using Plots #TODO FOR TESTING PURPOSE. TO BE REMOVED
const R = 6371.0e3

struct SphereC{T<:Union{Vector{Float64}, Float64}}
    phi::T
    theta::T
end

struct CartC{T<:Union{Vector{Float64}, Float64}}
    x::T
    y::T
    z::T
end

struct StereoC{T<:Union{Vector{Float64}, Float64}}
    x::T
    y::T
end

"""
    sphere_to_cart(phi, theta)

Convert spherical coordinates (`phi`, `theta`) to cartesian coordinates. 

# Examples
```julia-repl
julia> sphere_to_cart(0, 0)
CartC{Float64}(6.371e6, 0.0, 0.0)
```
See also: [`sphere_to_cart(coord::SphereC)`](@ref)
"""
function sphere_to_cart(phi, theta)
    return CartC(
        R * cos.(phi) .* cos.(theta),
        R * sin.(phi) .* cos.(theta),
        R * sin.(theta)
    )
end
sphere_to_cart(coord::SphereC) = sphere_to_cart(coord.phi, coord.theta)

"""
    cart_to_stereo(x, y, z)

Convert cartesian coordinates (`x`, `y`, `z`) to 2D stereographical coordinates. 

See also: [`cart_to_stereo(coord::CartC)`](@ref), `sphere_to_stereo(coord::SphereC)`](@ref)
"""
function cart_to_stereo(x, y, z)
    den = R .- z
    return StereoC(
        R * x ./ den,
        R * y ./ den
    )
end
cart_to_stereo(coord::CartC) = cart_to_stereo(coord.x, coord.y, coord.z)
sphere_to_stereo(coord::SphereC) = cart_to_stereo(sphere_to_cart(coord))

"""
    earth_coord(n::Int = 20)

Return the (`x`, `y`, `z`) cartesian coordinate of the spherical earth with `n` points for meridional and parallel directions.

"""
function earth_coord(n::Int = 20)
    phi = range(0, stop=2*π, length=n)
    theta = range(-π/2, stop=π/2, length=n)

    x = R * cos.(phi) .* cos.(theta)'
    y = R * sin.(phi) .* cos.(theta)'
    z = R * ones(n) * sin.(theta)'

    return (x, y, z)
end

"""
    poly_bilinear_interp(X::Vector{T}, Y::Vector{T}, values::Vector{T}) where T <: Real

Compute the coefficients for a bilinear polynomial interpolation

# Arguments
- `X::Vector{T}` and `Y::Vector{T}` : the 4 coordinates
- `values::Vector{T}` : the values at each coordinate

See also : [`poly_bilinear_interp(c::StereoC, values)`](@ref), [`poly_bilinear_interp(c::SphereC, values)`](@ref)
"""
function poly_bilinear_interp(X::Vector{T}, Y::Vector{T}, values::Vector{T}) where T <: Real
    A = [X[i]^(j%2) * Y[i]^(j÷2) for i in 1:4, j in 0:3]
    return A\values
end
poly_bilinear_interp(c::StereoC, values) = poly_bilinear_interp(c.x, c.y, values)
function poly_bilinear_interp(c::SphereC, values) 
    sph = sphere_to_stereo(c)
    poly_bilinear_interp(sph.x, sph.y, values)
end

"""
evaluate_interp(c::StereoC, coefs)

Evalute the bilinear polynomial with coefficients `coefs` at point `c`

See also : [`evaluate_interp(c::SphereC, coefs)`](@ref), [`evaluate_interp(phi, theta, coefs)`](@ref)
"""
function evaluate_interp(c::StereoC, coefs)
    sum([1, c.x, c.y, c.x*c.y] .* coefs)
end
evaluate_interp(c::SphereC, coefs) = evaluate_interp(sphere_to_stereo(c), coefs)
evaluate_interp(phi, theta, coefs) = evaluate_interp(SphereC(phi, theta), coefs)

"""
GC_distance(c1::SphereC, c2::SphereC)

Compute the great circle distance between points `c1` and `c2`

See also : [`GC_distance(phi1, theta1, phi2, theta2)`](@ref)
"""
function GC_distance(c1::SphereC, c2::SphereC)
    return 2 * R * asin.(sqrt.(sin.((c2.theta .- c1.theta) / 2).^2 
        + cos.(c1.theta) * cos.(c2.theta) * sin.((c2.phi - c1.phi)/2).^2))
end
GC_distance(phi1, theta1, phi2, theta2) = GC_distance(SphereC(phi1, theta1), SphereC(phi2, theta2))

@recipe function f(c::SphereC) 
    markershape --> :circle # if markershape is unset, make it :circle
    markersize --> 1
    seriestype --> :scatter
    cart = sphere_to_cart(c)
    typeof(c) == SphereC{Float64} ? ([cart.x], [cart.y], [cart.z]) : (cart.x, cart.y, cart.z)
end

@recipe function f(c::CartC, customcolor = :green) 
    markershape --> :circle 
    markercolor := customcolor # force markercolor to be customcolor
    markersize --> 1
    seriestype --> :scatter
    (c.x, c.y, c.z)
end

@recipe function f(c::StereoC) 
    markershape --> :rect
    markersize --> 1
    seriestype --> :scatter
    (c.x, c.y, zeros(length(c.x)))
end

@recipe function f(c::StereoC, val::Union{Vector{Float64}, Float64})
    markershape --> :circle
    markersize --> 2
    seriestype --> :scatter
    typeof(val) == Float64 ? ([c.x], [c.y], [val]) : (c.x, c.y, val)
end

end