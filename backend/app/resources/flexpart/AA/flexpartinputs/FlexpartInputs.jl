module FlexpartInputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation
using SearchLight, SearchLight.Relationships
import Base: @kwdef
using CbrnAlertApp.FlexpartValidator
using Dates

using UUIDs
using Dates
using FlexExtract
using JSON3
using StructTypes

using CbrnAlertApp: STATUS_CREATED, STATUS_FINISHED, STATUS_ONGOING, STATUS_ERRORED
using CbrnAlertApp: EXTRACTED_WEATHER_DATA_DIR

using CbrnAlertApp.FlexpartValidator
using CbrnAlertApp.Users

using CbrnAlertApp: API

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
    status::String = STATUS_CREATED
    error_message::Union{String, Nothing} = ""
end

Validation.validator(::Type{FlexpartInput}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

Base.Dict(x::FlexpartInput) = Dict(
    # :type => "flexpartResultId",
    :uuid => x.uuid,
    :name => x.name,
    :status => x.status,
    :date_created => x.date_created,
    :control => get_control(x)
)

API.FlexpartInput(x::FlexpartInput) = API.FlexpartInput(;
    uuid = x.uuid,
    name = x.name,
    status = x.status,
    date_created = x.date_created,
    control = Dict{String, String}([string(k) => string(v) for (k,v) in get_control(x)])
)

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

function add_existing(fepath::String)
    fedir = FlexExtractDir(fepath)
    name = basename(fedir.path)
    fcontrol = FeControl(fedir)
    newentry = FlexpartInput(
        uuid=name,
        name=name,
        path=relpath(fedir.path),
        control=JSON3.write(fcontrol.dict),
        status=STATUS_FINISHED
    )
    newentry |> save!
end

isfinished(entry) = entry.status == STATUS_FINISHED

function change_status!(input::FlexpartInput, value::String)
    input.status = value
    input |> save!
end

function add_error_message!(input::FlexpartInput, value::String)
    input.error_message = value
    input |> save!
end

change_status!(uuid::String, value::String) = change_status!(findone(FlexpartInput, uuid=uuid), value)

function assign_to_user!(user::Users.User, fpinput::FlexpartInput)
    Relationship!(user, fpinput)
end

function change_control!(input::FlexpartInput, fcontrol::FeControl)
    input.control = JSON3.write(fcontrol)
    # entry.options = fpoptions.options
    # entry.options = ""
    input |> save!
end

function get_control(input::FlexpartInput)
    JSON3.read(input.control)
end

function clear!()
    non_finished_inputs = find(FlexpartInput, SQLWhereExpression("status == ? OR status == ? OR status == ?", STATUS_ERRORED, STATUS_ONGOING, STATUS_CREATED))
    for entry in non_finished_inputs
        delete!(entry)
    end
end

function delete_empty_output()
    entries = all(FlexpartInput)
    for entry in entries
        fedir = FlexExtractDir(entry.path)
        inputs = readdir(fedir[:output])
        if length(inputs) == 0
            delete!(entry)
        end
    end
end

function delete_non_existing!()
    entries = all(FlexpartInput)
    for entry in entries
        if !isdir(entry.path)
            SearchLight.delete(entry)
        end
    end
end

delete_from_disk(entry::FlexpartInput) = isdir(entry.path) && rm(entry.path, recursive=true)

function delete!(entry::FlexpartInput)::FlexpartInput
    delete_from_disk(entry)
    SearchLight.delete(entry)
    return entry
end

delete!(uuid::String)::FlexpartInput = delete!(SearchLight.findone(FlexpartInput, uuid = uuid))

end