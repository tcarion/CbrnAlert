module FlexpartRuns

using SearchLight
import SearchLight: AbstractModel, DbId
using SearchLight.Validation
using SearchLight.Relationships
import Base: @kwdef
using Dates
using CbrnAlertApp.FlexpartValidator

using UUIDs
using Flexpart
using JSON3
using StructTypes

using CbrnAlertApp: STATUS_CREATED, STATUS_FINISHED, STATUS_ONGOING, STATUS_ERRORED
using CbrnAlertApp: FLEXPART_RUNS_DIR

using CbrnAlertApp.Users

using CbrnAlertApp: API

export FlexpartRun

# import ..UserApp: FLEXPART_RUNS_DIR


# StructTypes.StructType(::Type{OptionType}) = StructTypes.Struct()
# StructTypes.StructType(::Type{OptionType}) = StructTypes.DictType()

# convert(::Type{Union{}}, ::AbstractString) = ""

# Base.convert(::Type{OptionType}, x::AbstractString) = JSON3.read(x, OptionType)
# Base.convert(::Type{String}, x::OptionType) = JSON3.write(x)
# Base.string(x::OptionType) = JSON3.write(x)
# Base.convert(::Type{Nothing}, ::AbstractString) = ""
# function Base.convert(::Type{Union{OptionType, Nothing}}, x::AbstractString)
#     if x == ""
#         nothing
#     else
#         JSON3.read(x)
#     end
# end

@kwdef mutable struct FlexpartRun <: AbstractModel
    id::DbId = DbId()
    uuid::String = ""
    name::String = ""
    path::String = ""
    date_created::DateTime = Dates.now()
    status::String = STATUS_CREATED
    options::String = ""
    # options::OptionType = OptionType()
end

Validation.validator(::Type{FlexpartRun}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

API.FlexpartRun(x::FlexpartRun) = API.FlexpartRun(;
  uuid = x.uuid,
  name = x.name,
  status = x.status,
  date_created = x.date_created,
  options = FlexpartRuns.get_options(x)
)

_get_run(id) = findone(FlexpartRun, uuid = id)

function create()
    uuid = string(UUIDs.uuid4())
    path = joinpath(FLEXPART_RUNS_DIR, uuid)
    mkpath(path)
    fpsim = Flexpart.create(path)
    fpoptions = FlexpartOption(fpsim)
    newentry = FlexpartRun(
        uuid=uuid,
        name=uuid,
        path=relpath(path),
        options=JSON3.write(fpoptions.options)
        # date_created = Dates.format(Dates.now(), DATE_FORMAT)
    )
    newentry |> save!
end

function add_existing(fppath::String)
    fpsim = FlexpartSim(abspath(joinpath(fppath, "pathnames")))
    name = basename(fppath)
    fpoptions = FlexpartOption(fpsim)
    Flexpart.remove_unused_species!(fpoptions)
    newentry = FlexpartRun(
        uuid=name,
        name=name,
        path=relpath(fppath),
        options=JSON3.write(fpoptions.options),
        status=STATUS_FINISHED
    )
    newentry |> save!
end

isfinished(entry) = entry.status == STATUS_FINISHED
isongoing(entry) = entry.status == STATUS_ONGOING
iserrored(entry) = entry.status == STATUS_ERRORED

function change_status!(name::String, value::String)
    entry = findone(FlexpartRun, name=name)
    entry.status = value
    entry |> save!
end

function change_options!(name::String, fpoptions::FlexpartOption)
    entry = findone(FlexpartRun, name=name)
    entry.options = JSON3.write(fpoptions.options)
    # entry.options = fpoptions.options
    # entry.options = ""
    entry |> save!
end

function get_options(entry::FlexpartRun)
    JSON3.read(entry.options)
end

function assign_to_user!(user::Users.User, fpres::FlexpartRun)
    Relationship!(user, fpres)
end

function delete_non_existing!()
    entries = all(FlexpartRun)
    for entry in entries
        if !isdir(entry.path)
            SearchLight.delete(entry)
        end
    end
end

function delete_errored!()
    entries = all(FlexpartRun)
    errored = filter(x -> x.status == STATUS_ERRORED, entries)
    for entry in errored
        SearchLight.delete(entry)
    end
end

function delete_unfinished!()
    entries = all(FlexpartRun)
    unfinished = filter(x -> x.status !== STATUS_FINISHED, entries)
    for entry in unfinished
        SearchLight.delete(entry)
    end
end

function delete!(entry::FlexpartRun)::FlexpartRun
    isdir(entry.path) && rm(entry.path, recursive=true)
    SearchLight.delete(entry)
    return entry
end

function delete!(uuid::String)::FlexpartRun
    entry = findone(FlexpartRun, uuid=uuid)
    delete!(entry)
end

end