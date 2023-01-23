module FlexpartInputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation
using SearchLight, SearchLight.Relationships
import Base: @kwdef
using CbrnAlertApp.FlexpartValidator
using Dates

using UUIDs
using Dates
using Flexpart.FlexExtract
using JSON3
using StructTypes

using CbrnAlertApp: CREATED, FINISHED, ONGOING, ERRORED
using CbrnAlertApp: EXTRACTED_WEATHER_DATA_DIR

using CbrnAlertApp.FlexpartValidator
using CbrnAlertApp.Users

export FlexpartInput

# import ..UserApp: EXTRACTED_WEATHER_DATA_DIR


# StructTypes.StructType(::Type{FeControl}) = StructTypes.DictType()

# Base.convert(::Type{String}, x::FeControl) = JSON3.write(x)
# Base.convert(::Type{FeControl}, x::FeControl) = JSON3.read(x, Fe)


@kwdef mutable struct FlexpartInput <: AbstractModel
    id::DbId = DbId()
    # id as uuid4
    uuid::String = ""
    # user customizable name
    name::String = ""
    # path to the FlexExtract directory
    path::String = ""
    # Control file options in JSON format
    control::String = ""
    date_created::DateTime = Dates.now()
    status::String = CREATED
end

Validation.validator(::Type{FlexpartInput}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

function create()
    uuid = string(UUIDs.uuid4())
    path = joinpath(EXTRACTED_WEATHER_DATA_DIR, uuid)
    fedir = FlexExtract.create(path)
    default_control = FeControl(fedir)
    newentry = FlexpartInput(
        uuid=uuid,
        name=uuid,
        path=relpath(path),
        control=JSON3.write(default_control)
    )
    newentry |> save!, fedir
end

function add(fepath::String)
    fedir = FlexExtractDir(fepath, joinpath(fepath, "CONTROL_OD.OPER.FC.eta.highres"))
    name = basename(fedir.path)
    uuid = string(UUIDs.uuid4())
    fcontrol = FeControl(fedir)
    newentry = FlexpartInput(
        uuid=uuid,
        name=name,
        path=relpath(fedir.path),
        control=JSON3.write(fcontrol.dict)
    )
    newentry |> save!
end

isfinished(entry) = entry.status == FINISHED

function change_status(uuid::String, value::String)
    input = findone(FlexpartInput, uuid=uuid)
    input.status = value
    input |> save!
end

function assign_to_user!(user::Users.User, fpinput::FlexpartInput)
    Relationship!(user, fpinput)
end

function change_control(uuid::String, fcontrol::FeControl)
    entry = findone(FlexpartInput, uuid=uuid)
    entry.control = JSON3.write(fcontrol)
    # entry.options = fpoptions.options
    # entry.options = ""
    entry |> save!
end

function get_control(input::FlexpartInput)
    JSON3.read(input.control)
end

Base.Dict(x::FlexpartInput) = Dict(
    # :type => "flexpartResultId",
    :uuid => x.uuid,
    :name => x.name,
    :status => x.status,
    :date_created => x.date_created,
    :control => get_control(x)
)

end