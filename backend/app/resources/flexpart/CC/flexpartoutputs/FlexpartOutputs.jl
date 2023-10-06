module FlexpartOutputs

import SearchLight: AbstractModel, DbId
using SearchLight, SearchLight.Relationships
using SearchLight.Validation, CbrnAlertApp.FlexpartValidator
import Base: @kwdef

using UUIDs
using Dates
using Rasters
using JSON3
using Flexpart
using Flexpart: AbstractOutputFile

using CbrnAlertApp.FlexpartRuns
using CbrnAlertApp.FlexpartRuns: FlexpartRun

using CbrnAlertApp: FLEXPART_RUNS_DIR

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

Base.Dict(x::FlexpartOutput) = Dict(
    :uuid => x.uuid,
    :name => x.name,
    :date_created => x.date_created,
    :metadata => x.metadata,
)

function add!(output::AbstractOutputFile)
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

function add!(fprun::FlexpartRun)
    isempty(related(fprun, FlexpartOutput)) || return nothing
    fpsim = FlexpartSim(joinpath(fprun.path, "pathnames"))
    outfiles = Flexpart.OutputFiles(fpsim)
    for outfile in outfiles
      fpoutput = FlexpartOutputs.add!(outfile)
      FlexpartOutputs.assign_to_run!(fprun, fpoutput)
    end
end

function add_all!()
    all_runs = all(FlexpartRun)
    for fprun in all_runs
        add!(fprun)
    end
end

function assign_to_run!(uuid::String, fpoutput::FlexpartOutput)
    fprun = findone(FlexpartRuns.FlexpartRun, uuid = uuid)
    assign_to_run!(fprun, fpoutput)
end

assign_to_run!(fprun::FlexpartRun, fpoutput::FlexpartOutput) = Relationship!(fprun, fpoutput)

function delete_non_existing!()
    entries = all(FlexpartOutput)
    for entry in entries
        if !isfile(entry.path)
            SearchLight.delete(entry)
        end
    end
end

end
