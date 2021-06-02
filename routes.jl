using Genie.Router, Genie.Requests, Genie.Assets
using ATPController
using FlexpartController
using FlexpartsController
using DashboardController

using Atp45sController

using UUIDs

Genie.config.websockets_server = true


atp45_routes = Dict(
    "available_steps" => Atp45sController.available_steps,
    "available_gribfiles" => Atp45sController.available_grib_files,
    "prediction_request" => Atp45sController.prediction_request,
    "archive_retrieval" => Atp45sController.archive_retrieval,
    "realtime_available_steps" => Atp45sController.realtime_available_steps,
    "realtime_prediction_request" => Atp45sController.realtime_prediction_request,
)

flexpart_routes = Dict(
    "metdata_retrieval" => FlexpartsController.flexextract_request,
    "available_flexpart_input" => FlexpartsController.available_flexpart_input,
    "flexpart_run" => FlexpartsController.flexpart_run,
    "flexpart_results" => FlexpartsController.flexpart_results,
    "flexpart_conc" => FlexpartsController.flexpart_conc,
    "flexpart_geojson_conc" => FlexpartsController.flexpart_geojson_conc
)

route("/atp45", method = POST) do
    payload = jsonpayload()
    request = payload["request"]
    @info request
    if haskey(atp45_routes, request)
        return Genie.Renderer.Json.json(atp45_routes[request](payload))
    else
        return Genie.Renderer.Json.json(nothing)
    end
end

route("/flexpart", method = POST) do
    payload = jsonpayload()
    request = payload["request"]
    @info request
    if haskey(flexpart_routes, request)
        return Genie.Renderer.Json.json(flexpart_routes[request](payload))
    else
        return Genie.Renderer.Json.json(nothing)
    end
end

route("/") do 
    Genie.Renderer.redirect(:dashboard) 
end

route("/ngapp") do 
    serve_static_file("ngapp/dist/ngapp/index.html")
end
route("/dashboard", DashboardController.dashboard, named = :dashboard)

route("/atp45/load", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction)

route("/atp45/load/:file::String", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction_picked)

route("/atp45/realtime_atp_prediction", ATPController.realtime_atp_prediction, named = :realtime_atp_prediction)

route("/atp45/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp45/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

route("/atp45/mars_request", ATPController.mars_request, method = POST, named = :mars_request)

# route("/atp45/available_steps", Atp45sController.available_steps, method = POST, named = :available_steps)

# route("/atp45/available_gribfiles", Atp45sController.available_grib_files, method = GET, named = :available_grib_files)

# route("/atp45/prediction_request", Atp45sController.prediction_request, method = POST, named = :prediction_request)

# route("/atp45/archive_retrieval", Atp45sController.archive_retrieval, method = POST, named = :archive_retrieval)

# route("/atp45/realtime_available_steps", Atp45sController.realtime_available_steps, method = GET, named = :realtime_available_steps)

# route("/atp45/realtime_prediction_request", Atp45sController.realtime_prediction_request, method = POST, named = :realtime_prediction_request)

# route("/flexpart/metdata_retrieval", FlexpartsController.flexextract_request, method = POST, named = :metdata_retrieval)

# route("/flexpart/available_flexpart_input", FlexpartsController.available_flexpart_input, method = GET, named = :available_flexpart_input)


route("/flexpart/extract_met_data", FlexpartController.extract_met_data, named= :extract_met_data)

route("/flexpart/flexextract_request", FlexpartController.flexextract_request, method = POST, named= :flexextract_request)

route("/flexpart/flexpart_preloaded", FlexpartController.flexpart_preloaded, method = GET, named= :flexpart_preloaded)

route("/flexpart/flexpart_run_request", FlexpartController.flexpart_run_request, method = POST, named= :flexpart_run_request)

route("/flexpart/flexpart_run_output", FlexpartController.flexpart_run_output, method = POST, named= :flexpart_run_output)

route("/getchannel", method = GET) do
    channel = "$(uuid4())"
    Genie.Assets.channels_support(channel)
    Genie.Renderer.Json.json(Dict(:channel => channel))
end

# route("/initws", method = POST) do
#     Genie.Assets.channels_support(jsonpayload()["channel"])
#     Genie.Renderer.Json.json(Dict(:channel => jsonpayload()["channel"]))
# end
# channel("/:default_ch/:client_ch") do 
#     "def_ch = $(payload(:default_ch))       payload : $(@params(:payload))"
# end
# channel("realtime_atp_prediction/shape_request", ATPController.atp_shape_request_realtime)

# route("/websocket_test") do 

#     Assets.channels_support() *
#     """
#     <script>
#     window.parse_payload = function(payload) {
#         console.log('Got this payload: ' + payload);
#         }
#     </script>
#     """
# end

# channel("/coucou/mess") do 
#     "RECEIVED : $(@params(:WS_CLIENT))"
# end

channel("") do 
    println("message received")
end
