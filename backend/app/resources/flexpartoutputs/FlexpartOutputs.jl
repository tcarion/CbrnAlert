module FlexpartOutputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation, CbrnAlertApp.FlexpartValidator
import Base: @kwdef

using Dates

export FlexpartOutput

@kwdef mutable struct FlexpartOutput <: AbstractModel
    id::DbId = DbId()
	uuid::String = "" # id as uuid4
	name::String = "" # user-friendly name
	path::String = "" # path to the file
	date_created::DateTime = Dates.now()
	filetype::String = "" # type of the output file (ncf, binary)
	isnested::Bool = false # if output is nested
	metadata::String = "" # metadata in JSON format
end

Validation.validator(::Type{FlexpartOutput}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    # ValidationRule(:path, FlexpartValidator.not_empty),
    # ValidationRule(:path, FlexpartValidator.is_unique),
])


end
