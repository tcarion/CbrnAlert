module FlexpartInputsController

using Dates

using Genie
using Genie.Requests
using Genie.Renderer.Json: json

using Flexpart
using FlexExtract

using CbrnAlertApp: STATUS_ONGOING, STATUS_ERRORED, STATUS_FINISHED
using CbrnAlertApp: EXTRACTED_WEATHER_DATA_DIR
using CbrnAlertApp: _area, round_area

using CbrnAlertApp.Users
using CbrnAlertApp.Users: current_user
using CbrnAlertApp.FlexpartInputs

using CbrnAlertApp: API

const DATA_NOT_YET_AVAILABLE = Genie.Router.error(500, "Mars Retrieval error: DATA_NOT_YET_AVAILABLE", "application/json", error_info="The data you're requesting is not yet available")
const UNKNOWN_MARS_ERROR = Genie.Router.error(500, "Mars Retrieval error: Unknown", "application/json", error_info="Unknown error during data retrieval")
struct MarsDataNotAvailableError <: Exception end
struct UnknownMarsError <: Exception end

function _check_mars_errors(filepath)
  lines = readlines(filepath)
  haserror = false
  for line in lines
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
  fcontrol[:ACCTYPE] = "FC"
  set_area!(fcontrol, area)
  set_steps!(fcontrol, start_date, end_date, time_step)

  FlexExtract.save(fcontrol)

  log_file_path = joinpath(fedir.path, "output_log.log")
  FlexpartInputs.change_control!(newinput, fcontrol)
  FlexpartInputs.change_status!(newinput, STATUS_ONGOING)
  open(log_file_path, "w") do logf
      try 
          @info "Start retrieving at $(fedir.path). Starting date: $(fcontrol[:START_DATE])"
          FlexExtract.submit(fedir) do stream
              # log_and_broadcast(stream, ws_info, log_file)
              line = readline(stream, keep=true)
              Base.write(logf, line)
              flush(logf)
          end
      catch
          @info "An error occured while submitting. UUID : $(newinput.uuid)"
          FlexpartInputs.change_status!(newinput, STATUS_ERRORED)
          FlexpartInputs.add_error_message!(newinput, join(readlines(log_file_path; keep = true), ""))
          if ENV["GENIE_ENV"] == "prod"
            FlexpartInputs.delete_from_disk(newinput)
          end
          rethrow()
      end
  end

  try
      _check_mars_errors(log_file_path)
      FlexpartInputs.change_status!(newinput, STATUS_FINISHED)
      FlexpartInputs.change_control!(newinput, FeControl(FlexExtractDir(newinput.path)))
      @info "Flexpart with uuid = $(newinput.uuid) succeeded."
  catch e
      @info "The submission with uuid = $(newinput.uuid) failed."
      FlexpartInputs.change_status!(newinput, STATUS_ERRORED)
      FlexpartInputs.add_error_message!(newinput, join(readlines(log_file_path; keep = true), ""))
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
    FlexpartInputs.delete_non_existing!()
    fpinputs = user_related(FlexpartInput)
    filter!(FlexpartInputs.isfinished, fpinputs)
    fpinputs_names = [input.name for input in fpinputs]
    if sort(readdir(EXTRACTED_WEATHER_DATA_DIR)) != sort(fpinputs_names)
        for new_fedir in setdiff(readdir(EXTRACTED_WEATHER_DATA_DIR), fpinputs_names)
            newinput = FlexpartInputs.add_existing(joinpath(EXTRACTED_WEATHER_DATA_DIR, new_fedir))
            FlexpartInputs.assign_to_user!(current_user(), newinput)
        end
    end
    fpinputs = user_related(FlexpartInput)
    response = Dict.(fpinputs)
    return response |> json
end

function delete_input()
    uuid = Genie.Router.params(:inputId)
    to_delete = FlexpartInputs.delete!(uuid)
    @show to_delete
    return API.FlexpartInput(to_delete) |> json
end

end