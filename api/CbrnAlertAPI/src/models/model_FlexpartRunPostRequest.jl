# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.



@doc raw"""
    FlexpartRunPostRequest(; value=nothing)
"""
mutable struct FlexpartRunPostRequest <: OpenAPI.OneOfAPIModel
    value::Any # Union{ FlexpartOptionsSimple }
    FlexpartRunPostRequest() = new()
    FlexpartRunPostRequest(value) = new(value)
end # type FlexpartRunPostRequest

function OpenAPI.property_type(::Type{ FlexpartRunPostRequest }, name::Symbol, json::Dict{String,Any})
    
    # no discriminator specified, can't determine the exact type
    return fieldtype(FlexpartRunPostRequest, name)
end