# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.


@doc raw"""
    Atp45InputWeatherInputOneOf(;
        archiveDate=nothing,
    )

    - archiveDate::ZonedDateTime
"""
Base.@kwdef mutable struct Atp45InputWeatherInputOneOf <: OpenAPI.APIModel
    archiveDate::Union{Nothing, ZonedDateTime} = nothing

    function Atp45InputWeatherInputOneOf(archiveDate, )
        OpenAPI.validate_property(Atp45InputWeatherInputOneOf, Symbol("archiveDate"), archiveDate)
        return new(archiveDate, )
    end
end # type Atp45InputWeatherInputOneOf

const _property_types_Atp45InputWeatherInputOneOf = Dict{Symbol,String}(Symbol("archiveDate")=>"ZonedDateTime", )
OpenAPI.property_type(::Type{ Atp45InputWeatherInputOneOf }, name::Symbol) = Union{Nothing,eval(Base.Meta.parse(_property_types_Atp45InputWeatherInputOneOf[name]))}

function check_required(o::Atp45InputWeatherInputOneOf)
    o.archiveDate === nothing && (return false)
    true
end

function OpenAPI.validate_property(::Type{ Atp45InputWeatherInputOneOf }, name::Symbol, val)
    if name === Symbol("archiveDate")
        OpenAPI.validate_param(name, "Atp45InputWeatherInputOneOf", :format, val, "date-time")
    end
end
