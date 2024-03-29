# This file was generated by the Julia OpenAPI Code Generator
# Do not modify this file directly. Modify the OpenAPI specification instead.


@doc raw"""
    GeoJsonSliceResponse(;
        collection=nothing,
        metadata=nothing,
    )

    - collection::GeoJsonSliceResponseCollection
    - metadata::GeoJsonSliceResponseMetadata
"""
Base.@kwdef mutable struct GeoJsonSliceResponse <: OpenAPI.APIModel
    collection = nothing # spec type: Union{ Nothing, GeoJsonSliceResponseCollection }
    metadata = nothing # spec type: Union{ Nothing, GeoJsonSliceResponseMetadata }

    function GeoJsonSliceResponse(collection, metadata, )
        OpenAPI.validate_property(GeoJsonSliceResponse, Symbol("collection"), collection)
        OpenAPI.validate_property(GeoJsonSliceResponse, Symbol("metadata"), metadata)
        return new(collection, metadata, )
    end
end # type GeoJsonSliceResponse

const _property_types_GeoJsonSliceResponse = Dict{Symbol,String}(Symbol("collection")=>"GeoJsonSliceResponseCollection", Symbol("metadata")=>"GeoJsonSliceResponseMetadata", )
OpenAPI.property_type(::Type{ GeoJsonSliceResponse }, name::Symbol) = Union{Nothing,eval(Base.Meta.parse(_property_types_GeoJsonSliceResponse[name]))}

function check_required(o::GeoJsonSliceResponse)
    o.collection === nothing && (return false)
    true
end

function OpenAPI.validate_property(::Type{ GeoJsonSliceResponse }, name::Symbol, val)
end
