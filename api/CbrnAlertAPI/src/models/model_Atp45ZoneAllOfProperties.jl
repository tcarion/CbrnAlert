# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.


@doc raw"""
    Atp45ZoneAllOfProperties(;
        type=nothing,
        shape=nothing,
    )

    - type::String
    - shape::String
"""
Base.@kwdef mutable struct Atp45ZoneAllOfProperties <: OpenAPI.APIModel
    type::Union{Nothing, String} = nothing
    shape::Union{Nothing, String} = nothing

    function Atp45ZoneAllOfProperties(type, shape, )
        OpenAPI.validate_property(Atp45ZoneAllOfProperties, Symbol("type"), type)
        OpenAPI.validate_property(Atp45ZoneAllOfProperties, Symbol("shape"), shape)
        return new(type, shape, )
    end
end # type Atp45ZoneAllOfProperties

const _property_types_Atp45ZoneAllOfProperties = Dict{Symbol,String}(Symbol("type")=>"String", Symbol("shape")=>"String", )
OpenAPI.property_type(::Type{ Atp45ZoneAllOfProperties }, name::Symbol) = Union{Nothing,eval(Base.Meta.parse(_property_types_Atp45ZoneAllOfProperties[name]))}

function check_required(o::Atp45ZoneAllOfProperties)
    true
end

function OpenAPI.validate_property(::Type{ Atp45ZoneAllOfProperties }, name::Symbol, val)
end
