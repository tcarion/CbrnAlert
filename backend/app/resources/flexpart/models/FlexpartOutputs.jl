module FlexpartOutputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation, FlexpartValidator
using SearchLight, SearchLight.Relationships
import Base: @kwdef

using UUIDs
using Dates
using Rasters
using JSON3

using FlexpartRuns

export FlexpartOutput

@kwdef mutable struct FlexpartOutput <: AbstractModel
    id::DbId = DbId()
	uuid::String = "" # id as uuid4
	name::String = "" # name as uuid4
	path::String = "" # path to the file
	date_created::DateTime = Dates.now()
	filetype::String = "" # type of the output file (netcdf, binary)
	nested::Boolean = "" # if output is nested
	metadata::String = "" # metadata in JSON format
end

Validation.validator(::Type{FlexpartOutput}) = ModelValidator([
    ValidationRule(:name, FlexpartValidator.not_empty),
    ValidationRule(:name, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

function add(fprun::FlexpartRun)
	path = fprun.path
	rast = RasterStack(path)
	meta = JSON3.write(Dict(rast.metadata))
end

end
