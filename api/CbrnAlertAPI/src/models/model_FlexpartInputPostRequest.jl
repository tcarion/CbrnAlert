# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.



@doc raw"""
    FlexpartInputPostRequest(; value=nothing)
"""
mutable struct FlexpartInputPostRequest <: OpenAPI.OneOfAPIModel
    value::Any # Union{ FlexpartRetrieveSimple }
    FlexpartInputPostRequest() = new()
    FlexpartInputPostRequest(value) = new(value)
end # type FlexpartInputPostRequest

function OpenAPI.property_type(::Type{ FlexpartInputPostRequest }, name::Symbol, json::Dict{String,Any})
    
    # no discriminator specified, can't determine the exact type
    return fieldtype(FlexpartInputPostRequest, name)
end
