module FlexpartInputsController

using Dates

using Genie
using Genie.Requests
using Genie.Renderer.Json: json

using Flexpart
using Flexpart.FlexExtract

using CbrnAlertApp: STATUS_ONGOING, STATUS_ERRORED, STATUS_FINISHED
using CbrnAlertApp: _area, round_area

using CbrnAlertApp.Users
using CbrnAlertApp.Users: current_user
using CbrnAlertApp.FlexpartInputs


const DATA_NOT_YET_AVAILABLE = Genie.Router.error(500, "Mars Retrieval error: DATA_NOT_YET_AVAILABLE", "application/json", error_info="The data you're requesting is not yet available")
const UNKNOWN_MARS_ERROR = Genie.Router.error(500, "Mars Retrieval error: Unknown", "application/json", error_info="Unknown error during data retrieval")
struct MarsDataNotAvailableError <: Exception end
struct UnknownMarsError <: Exception end

function _check_mars_errors(filepath)
  lines = readlines(filepath)
  haserror = false
  map(lines) do line
      if occursin("DATA_NOT_YET_AVAILABLE", line)
          throw(MarsDataNotAvailableError())
      end
      if occursin("ERROR", line)
          haserror = true
      end
  end
  haserror && throw(UnknownMarsError())
  return haserror
end


function data_retrieval()
  payload = Genie.Requests.jsonpayload()
  start_date = payload["start"] |> DateTime
  end_date = payload["end"] |> DateTime
  area = round_area(_area(payload["area"]))
  gridres = payload["gridres"]
  time_step = convert(Int64, payload["timeStep"] / 3600)

  newinput, fedir = FlexpartInputs.create()
  FlexpartInputs.assign_to_user!(current_user(), newinput)
  fcontrol = FeControl(fedir)
  fcontrol[:GRID] = gridres
  fcontrol[:REQUEST] = 0
  set_area!(fcontrol, area)
  set_steps!(fcontrol, start_date, end_date, time_step)

  FlexExtract.save(fcontrol)

  FlexpartInputs.change_control(newinput.uuid, fcontrol)
  FlexpartInputs.change_status!(newinput.uuid, STATUS_ONGOING)
  log_file_path = joinpath(fedir.path, "output_log.log")
  open(log_file_path, "w") do logf
      try 
          FlexExtract.submit(fedir) do stream
              # log_and_broadcast(stream, ws_info, log_file)
              line = readline(stream, keep=true)
              Base.write(logf, line)
              flush(logf)
          end
      catch
          FlexpartInputs.change_status!(newinput.uuid, STATUS_ERRORED)
          FlexpartInputs.delete_from_disk(newinput)
          rethrow()
      end
  end

  try
      _check_mars_errors(log_file_path)
      FlexpartInputs.change_status!(newinput.uuid, STATUS_FINISHED)
  catch e
      FlexpartInputs.change_status!(newinput.uuid, STATUS_ERRORED)
      FlexpartInputs.delete_from_disk(newinput)
      if e isa MarsDataNotAvailableError
          # throw(Genie.Exceptions.RuntimeException("Mars Retrieval error: DATA_NOT_YET_AVAILABLE", "The data you're requesting is not yet available", 500, e))
          return DATA_NOT_YET_AVAILABLE
      elseif e isa UnknownMarsError
          # throw(Genie.Exceptions.RuntimeException("Mars Retrieval error: Unknown", "Unknown error during data retrieval", 500, e))
          return UNKNOWN_MARS_ERROR
      else
          throw(e)
      end
  end

  return Dict(newinput) |> json
end

function _find_control_path(fedirpath)::FlexExtractDir
  fefiles = readdir(fedirpath, join=true)
  i = findfirst(x -> occursin("CONTROL", x), fefiles)
  FlexExtractDir(fedirpath, fefiles[1])
end
function _clarify_control(fcontrol)
  startday = Dates.DateTime(fcontrol[:START_DATE], "yyyymmdd")
  times = Base.parse.(Int, split(fcontrol[:TIME], " "))
  steps = Base.parse.(Int, split(fcontrol[:STEP], " "))
  gridres = Base.parse(Float32, fcontrol[:GRID])
  timestep = steps[2] - steps[1]
  area = [
      fcontrol[:UPPER],
      fcontrol[:LEFT],
      fcontrol[:LOWER],
      fcontrol[:RIGHT]
  ]
  area = Base.parse.(Float32, area)

  startdate = startday + Dates.Hour(times[1])
  enddate = startday + Dates.Hour((length(times) - 1) * timestep)

  return Dict(
      :startDate => startdate,
      :endDate => enddate,
      :gridRes => gridres,
      :timeStep => timestep,
      :area => area
  )
end

function get_inputs()
  fpinputs = user_related(FlexpartInput)
  filter!(FlexpartInputs.isfinished, fpinputs)
  # metdata_dirs = [input.path for input in fpinputs]
  # names = [input.name for input in fpinputs]
  # fedirs = _find_control_path.(metdata_dirs)
  # fcontrols = FeControl.(fedirs)
  # clarified_controls = _clarify_control.(fcontrols)
  # response = map(zip(clarified_controls, names)) do (c, n)
  #     push!(c, :name => n)
  # end
  response = Dict.(fpinputs)
  return response |> json
end

function delete_input()
    id = Genie.Router.params(:inputId)
end

end