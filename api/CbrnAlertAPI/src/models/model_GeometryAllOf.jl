# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.


@doc raw"""
    GeometryAllOf(;
        type=nothing,
    )

    - type::String
"""
Base.@kwdef mutable struct GeometryAllOf <: OpenAPI.APIModel
    type::Union{Nothing, String} = nothing

    function GeometryAllOf(type, )
        OpenAPI.validate_property(GeometryAllOf, Symbol("type"), type)
        return new(type, )
    end
end # type GeometryAllOf

const _property_types_GeometryAllOf = Dict{Symbol,String}(Symbol("type")=>"String", )
OpenAPI.property_type(::Type{ GeometryAllOf }, name::Symbol) = Union{Nothing,eval(Base.Meta.parse(_property_types_GeometryAllOf[name]))}

function check_required(o::GeometryAllOf)
    o.type === nothing && (return false)
    true
end

function OpenAPI.validate_property(::Type{ GeometryAllOf }, name::Symbol, val)
    if name === Symbol("type")
        OpenAPI.validate_param(name, "GeometryAllOf", :enum, val, ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"])
    end
end
