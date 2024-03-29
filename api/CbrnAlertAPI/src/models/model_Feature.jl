# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.


@doc raw"""GeoJSon &#39;Feature&#39; object

    Feature(;
        type=nothing,
        bbox=nothing,
        geometry=nothing,
        properties=nothing,
        id=nothing,
    )

    - type::String
    - bbox::Vector{Float64}
    - geometry::Any
    - properties::Any
    - id::OneOfnumberstring
"""
Base.@kwdef mutable struct Feature <: OpenAPI.APIModel
    type::Union{Nothing, String} = nothing
    bbox::Union{Nothing, Vector{Float64}} = nothing
    geometry::Union{Nothing, Any} = nothing
    properties::Union{Nothing, Any} = nothing
    id = nothing # spec type: Union{ Nothing, OneOfnumberstring }

    function Feature(type, bbox, geometry, properties, id, )
        OpenAPI.validate_property(Feature, Symbol("type"), type)
        OpenAPI.validate_property(Feature, Symbol("bbox"), bbox)
        OpenAPI.validate_property(Feature, Symbol("geometry"), geometry)
        OpenAPI.validate_property(Feature, Symbol("properties"), properties)
        OpenAPI.validate_property(Feature, Symbol("id"), id)
        return new(type, bbox, geometry, properties, id, )
    end
end # type Feature

const _property_types_Feature = Dict{Symbol,String}(Symbol("type")=>"String", Symbol("bbox")=>"Vector{Float64}", Symbol("geometry")=>"Any", Symbol("properties")=>"Any", Symbol("id")=>"OneOfnumberstring", )
OpenAPI.property_type(::Type{ Feature }, name::Symbol) = Union{Nothing,eval(Base.Meta.parse(_property_types_Feature[name]))}

function check_required(o::Feature)
    o.type === nothing && (return false)
    o.geometry === nothing && (return false)
    o.properties === nothing && (return false)
    true
end

function OpenAPI.validate_property(::Type{ Feature }, name::Symbol, val)
    if name === Symbol("type")
        OpenAPI.validate_param(name, "Feature", :enum, val, ["Feature", "FeatureCollection", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"])
    end
end
