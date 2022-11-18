module FlexpartController
using Genie
using Genie.Requests
using Genie.Renderer.Json: json
using JSON3
using Dates
# using GeoJSON
using GeoJSON: Feature, FeatureCollection, Polygon, write
using GeoInterface
# using ..Main.UserApp.AuthenticationController: current_user
using CbrnAlertApp.AuthenticationController



using CbrnAlertApp.Users
using CbrnAlertApp.Users: current_user
using CbrnAlertApp.FlexpartRuns
using CbrnAlertApp.FlexpartInputs
using CbrnAlertApp.FlexpartOutputs

using SearchLight
using SearchLight.Relationships

const AC = AuthenticationController

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

const CONTROL_FILE_NAME = "CONTROL_OD.OPER.FC.eta.highres.app"

const FLEXPART_RUN_FAILED = Genie.Router.error(500, "Flexpart run failed", "application/json", error_info="Flexpart run failed")



global DEBUG_PAYLOAD_FP = 0
debug() = global DEBUG_PAYLOAD_FP = Genie.Requests.jsonpayload()

function round_area(area)
    return [ceil(area[1]), floor(area[2]), floor(area[3]), ceil(area[4])]
end

"""
    log_and_broadcast(stream, ws_info, log_file::IO)
Write the `stream` to a `log_file` stream and broadcast it the WebChannel given by `ws_info`
"""
function log_and_broadcast(stream, ws_info, log_file::IO)
    line = readline(stream, keep=true)
    to_send = Dict(:displayed => line, :backid => ws_info["backid"])
    Genie.WebChannels.broadcast(ws_info["channel"], "flexpart", to_send)
    Base.write(log_file, line)
    flush(log_file)
end

end
