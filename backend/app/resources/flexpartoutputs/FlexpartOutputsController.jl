module FlexpartOutputsController


using SearchLight, SearchLight.Relationships

using UUIDs
using Dates
using Rasters
using JSON3

using Flexpart: AbstractOutputFile

using CbrnAlertApp.FlexpartOutputs

using CbrnAlertApp.FlexpartRuns

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
	meta = JSON3.write(Dict(rast.metadata))
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
