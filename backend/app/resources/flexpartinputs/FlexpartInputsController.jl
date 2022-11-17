module FlexpartInputsController

using SearchLight, SearchLight.Relationships
using UUIDs
using Dates
using Flexpart.FlexExtract
using JSON3
using StructTypes

using CbrnAlertApp.FlexpartValidator
using CbrnAlertApp.FlexpartRuns
import CbrnAlertApp.Users

using CbrnAlertApp.SharedModels

using CbrnAlertApp.FlexpartInputs

function create()
  uuid = string(UUIDs.uuid4())
  path = joinpath(EXTRACTED_WEATHER_DATA_DIR, uuid)
  fedir = FlexExtract.create(path)
  default_control = FeControl(fedir)
  newentry = FlexpartInput(
      uuid = uuid,
      name = uuid,
      path = relpath(path),
      control = JSON3.write(default_control)
  )
  newentry |> save!, fedir
end

function add(fepath::String)
  fedir = FlexExtractDir(fepath, joinpath(fepath, "CONTROL_OD.OPER.FC.eta.highres"))
  name = basename(fedir.path)
  uuid = string(UUIDs.uuid4())
  fcontrol = FeControl(fedir)
  newentry = FlexpartInput(
      uuid = uuid,
      name = name,
      path = relpath(fedir.path),
      control = JSON3.write(fcontrol.dict)
  )
  newentry |> save!
end

isfinished(entry) = entry.status == FINISHED

function change_status(uuid::String, value::String)
  input = findone(FlexpartInput, uuid = uuid)
  input.status = value
  input |> save!
end

function assign_to_user!(user::Users.User, fpres::FlexpartInput)
  Relationship!(user, fpres)
end

function change_control(uuid::String, fcontrol::FeControl)
  entry = findone(FlexpartInput, uuid = uuid)
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
