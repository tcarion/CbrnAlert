using Genie.Router, Genie.Requests, Genie.Assets
using SearchLight
# using ATPController
# using FlexpartController
using Atp45Controller
using FlexpartController
using AuthenticationController
using JSONWebTokens
using StructTypes
using UUIDs

using Genie.Cache
Genie.config.cache_duration = 3600
Genie.Cache.init()

using SearchLight
using Users
for user in SearchLight.all(User)
    Genie.Assets.channels_subscribe(user.username)
end

Genie.config.websockets_server = true
# Genie.Cache.init()
# StructTypes.StructType(::Type{Genie.WebChannels.ChannelMessage}) = StructTypes.Struct()

atp45_routes = Dict(
    "available_steps" => Atp45Controller.available_steps,
    "available_gribfiles" => Atp45Controller.available_grib_files,
    "prediction_request" => Atp45Controller.prediction_request,
    "archive_retrieval" => Atp45Controller.archive_retrieval,
    "realtime_available_steps" => Atp45Controller.realtime_available_steps,
    "realtime_prediction_request" => Atp45Controller.realtime_prediction_request,
)

flexpart_routes = Dict(
    # "metdata_retrieval" => FlexpartController.flexextract_request,
    # "available_flexpart_input" => FlexpartController.available_flexpart_input,
    # "flexpart_run" => FlexpartController.flexpart_run,
    # "flexpart_options" => FlexpartController.flexpart_options,
    # "flexpart_results" => FlexpartController.flexpart_results,
    # "flexpart_conc" => FlexpartController.flexpart_conc,
    # "flexpart_geojson_conc" => FlexpartController.flexpart_geojson_conc,
    # "flexpart_daily_average" => FlexpartController.flexpart_daily_average,
)

api_routes = Dict(
    "/api/flexpart/meteo_data_request" => (f=FlexpartController.meteo_data_request, keyargs=(method=POST, named=:meteo_data_request)),
    "/api/flexpart/inputs" => (f=FlexpartController.available_flexpart_input, keyargs=(method=GET, named=:available_flexpart_input)),
    "/api/flexpart/run" => (f=FlexpartController.flexpart_run, keyargs=(method=POST, named=:flexpart_run)),
    "/api/flexpart/results" => (f=FlexpartController.get_results, keyargs=(method = GET, named = :get_flexpart_results)),
    "/api/flexpart/results/:result_id::String" => (f=FlexpartController.get_result, keyargs=(method=GET, named=:get_flexpart_result)),
    "/api/flexpart/results/:result_id::String/outputs" => (f=FlexpartController.get_outputs, keyargs=(method = GET, named = :get_flexpart_outputs)),
    "/api/flexpart/results/:result_id::String/outputs/:output_id::String" => (f=FlexpartController.get_output, keyargs=(method = GET, named = :get_flexpart_output)),
    "/api/flexpart/results/:result_id::String/output/:output_id::String" => (f=FlexpartController.get_plot, keyargs=(method = POST,)),
    "/api/flexpart/results/:result_id::String/output/:output_id::String/daily_average" => (f=FlexpartController.daily_average, keyargs=(method = POST,))
)

for (url, args) in api_routes
    route(url; args[:keyargs]...) do
        AuthenticationController.@authenticated!
        args[:f]()
    end
end

# route("/api/flexpart/results", method = GET, FlexpartController.get_results)
# route("/api/flexpart/results/:result_id::String/output/:output_id::String", method = GET, FlexpartController.get_plot)

# route("/api/flexpart/meteo_data_request", method = POST, FlexpartController.meteo_data_request, named = :meteo_data_request)
# route("/api/flexpart/results", method = GET, FlexpartController.get_results, named = :get_flexaprt_results)
# route("/api/flexpart/results/:result_id::String", method = GET, FlexpartController.get_result, named = :get_flexpart_result)


# route("/api/flexpart/results/:result_id::String/outputs", method = GET, FlexpartController.get_outputs, named = :get_flexpart_outputs)
# route("/api/flexpart/results/:result_id::String/outputs/:output_id::String", method = GET, FlexpartController.get_output, named = :get_flexpart_output)

# route("/api/flexpart/results/:result_id::String/output/:output_id::String", method = POST, FlexpartController.get_plot)
# route("/api/flexpart/results/:result_id::String/output/:output_id::String/daily_average", method = POST, FlexpartController.daily_average)
# route("/api/flexpart/results/:result_id", method = POST) do
#     println(params(:result_id))
# end
# route("/api/flexpart/results/:result_id::String/:output_id::String", method = GET, FlexpartController.get_output)
#     notauth = AuthenticationController.isauth()
#     !isnothing(notauth) && return notauth
#     # println(get(params, :test, ""))
#     # println(params(:test))
#     readdir(FLEXPART_RUNS_DIR) |> Genie.Renderer.Json.json
# end

route("/atp45", method = POST) do
    process_request(atp45_routes)
end
# HTTP.request("POST", "http://localhost:8000/flexpart", [("Content-Type", "application/json")], """{"request":"flexpart_results"}""")
route("/flexpart", method = POST) do
    process_request(flexpart_routes)
end

function process_request(routes)
    notauth = AuthenticationController.isauth()
    !isnothing(notauth) && return notauth
    payload = jsonpayload()
    request = payload["request"]
    @info request
    haskey(routes, request) ? Genie.Renderer.Json.json(routes[request](payload)) : Genie.Router.error(404, "Request not found")
end

route("/login", AuthenticationController.login, method = POST)

# route("/") do 
#     Genie.Renderer.redirect(:dashboard) 
# end

# route("/ngapp") do 
#     serve_static_file("ngapp/dist/ngapp/index.html")
# end

# route("/getchannel", method = GET) do
#     notauth = AuthenticationController.isauth()
#     !isnothing(notauth) && return notauth
#     channel = "$(uuid4())"
#     # Genie.Assets.channels_support(channel)
#     Genie.Assets.channels_subscribe(channel)
#     # @show Genie.Requests.wsclient()
#     Genie.Renderer.Json.json(Dict(:channel => channel))
# end



# route("/dashboard", DashboardController.dashboard, named = :dashboard)

# route("/atp45/load", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction)

# route("/atp45/load/:file::String", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction_picked)

# route("/atp45/realtime_atp_prediction", ATPController.realtime_atp_prediction, named = :realtime_atp_prediction)

# route("/atp45/archive_data", ATPController.archive_data, named = :archive_data)

# route("/atp45/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

# route("/atp45/mars_request", ATPController.mars_request, method = POST, named = :mars_request)

# route("/atp45/available_steps", Atp45Controller.available_steps, method = POST, named = :available_steps)

# route("/atp45/available_gribfiles", Atp45Controller.available_grib_files, method = GET, named = :available_grib_files)

# route("/atp45/prediction_request", Atp45Controller.prediction_request, method = POST, named = :prediction_request)

# route("/atp45/archive_retrieval", Atp45Controller.archive_retrieval, method = POST, named = :archive_retrieval)

# route("/atp45/realtime_available_steps", Atp45Controller.realtime_available_steps, method = GET, named = :realtime_available_steps)

# route("/atp45/realtime_prediction_request", Atp45Controller.realtime_prediction_request, method = POST, named = :realtime_prediction_request)

# route("/flexpart/metdata_retrieval", FlexpartController.flexextract_request, method = POST, named = :metdata_retrieval)

# route("/flexpart/available_flexpart_input", FlexpartController.available_flexpart_input, method = GET, named = :available_flexpart_input)


# route("/flexpart/extract_met_data", FlexpartController.extract_met_data, named= :extract_met_data)

# route("/flexpart/flexextract_request", FlexpartController.flexextract_request, method = POST, named= :flexextract_request)

# route("/flexpart/flexpart_preloaded", FlexpartController.flexpart_preloaded, method = GET, named= :flexpart_preloaded)

# route("/flexpart/flexpart_run_request", FlexpartController.flexpart_run_request, method = POST, named= :flexpart_run_request)

# route("/flexpart/flexpart_run_output", FlexpartController.flexpart_run_output, method = POST, named= :flexpart_run_output)



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

# channel("") do 
#     println("message received")
# end
