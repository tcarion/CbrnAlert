module FlexpartOutputs

import SearchLight: AbstractModel, DbId
using SearchLight, SearchLight.Relationships
using SearchLight.Validation, CbrnAlertApp.FlexpartValidator
import Base: @kwdef

using UUIDs
using Dates
using Rasters
using JSON3
using Flexpart: AbstractOutputFile

using CbrnAlertApp.FlexpartOutputs
using CbrnAlertApp.FlexpartRuns

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

function add(output::AbstractOutputFile)
    path = output.path
    d = Dict()
    if occursin("nest", path)
        d[:isnested] = true
    else
        d[:isnested] = false
    end
    @show output
	rast = RasterStack(path)
	meta = JSON3.write(Dict(Rasters.metadata(rast)))
    newentry = FlexpartOutput(
        uuid = string(UUIDs.uuid4()),
        name = basename(path),
        path = relpath(path),
        filetype = output.type,
        isnested = d[:isnested],
        metadata = meta
    )
    newentry |> save!
end

function assign_to_run!(uuid::String, fpoutput::FlexpartOutput)
    fprun = findone(FlexpartRuns.FlexpartRun, uuid = uuid)
    Relationship!(fprun, fpoutput)
end

Base.Dict(x::FlexpartOutput) = Dict(
    :uuid => x.uuid,
    :name => x.name,
    :date_created => x.date_created,
    :metadata => x.metadata,
)

end
