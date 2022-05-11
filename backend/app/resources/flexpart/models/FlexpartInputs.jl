module FlexpartInputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation, FlexpartValidator
using SearchLight, SearchLight.Relationships
import Base: @kwdef
import Users
using UUIDs
using Dates

export FlexpartInput
const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

@kwdef mutable struct FlexpartInput <: AbstractModel
    id::DbId = DbId()
    name::String = ""
    path::String = ""
    date_created::String = ""
    status::String = "created"
end

Validation.validator(::Type{FlexpartInput}) = ModelValidator([
    ValidationRule(:name, FlexpartValidator.not_empty),
    ValidationRule(:name, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

function create()
    name = string(UUIDs.uuid4())
    newentry = FlexpartInput(
        name = name,
        path = joinpath(EXTRACTED_WEATHER_DATA_DIR, name),
        date_created = Dates.format(Dates.now(), DATE_FORMAT)
    )
    newentry |> save!
end

isfinished(entry) = entry.status == "finish"

function change_status(name::String, value::String)
    input = findone(FlexpartInput, name = name)
    input.status = value
    input |> save!
end

function assign_to_user!(email::String, fpres::FlexpartInput)
    user = findone(Users.User, email = email)
    Relationship!(user, fpres)
end

end