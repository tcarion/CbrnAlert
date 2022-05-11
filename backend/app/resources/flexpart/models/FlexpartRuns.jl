module FlexpartRuns

using SearchLight
import SearchLight: AbstractModel, DbId
using SearchLight.Validation, SearchLight.Relationships, FlexpartValidator
import Base: @kwdef
import Users
using Dates
using UUIDs
# using Genie.UserApp: DATE_FORMAT
# using ..UserApp: DATE_FORMAT

export FlexpartRun

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"
const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

convert(::Type{Union{}}, ::AbstractString) = ""

@kwdef mutable struct FlexpartRun <: AbstractModel
    id::DbId = DbId()
    name::String = ""
    path::String = ""
    date_created::String = ""
    status::String = "created"
end

Validation.validator(::Type{FlexpartRun}) = ModelValidator([
    ValidationRule(:name, FlexpartValidator.not_empty),
    ValidationRule(:name, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

function create()
    name = string(UUIDs.uuid4())
    newentry = FlexpartRun(
        name = name,
        path = joinpath(FLEXPART_RUNS_DIR, name),
        date_created = Dates.format(Dates.now(), DATE_FORMAT)
    )
    newentry |> save!
end

isfinished(entry) = entry.status == "finish"

function change_status(name::String, value::String)
    entry = findone(FlexpartRun, name = name)
    entry.status = value
    entry |> save!
end

function assign_to_user!(email::String, fpres::FlexpartRun)
    user = findone(Users.User, email = email)
    Relationship!(user, fpres)
end

function delete_non_existing()
    entries = all(FlexpartRun)
    for entry in entries
        if !isdir(entry.path)
            delete(entry)
        end
    end
end

function delete(entry)
    isdir(entry.path) && rm(entry.path, recursive=true)
    delete(entry)
end

end
