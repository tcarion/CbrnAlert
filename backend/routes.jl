using Genie.Router, Genie.Requests, Genie.Assets
using SearchLight
# using ATPController
# using FlexpartController
using CbrnAlertApp.AuthenticationController
using CbrnAlertApp.Atp45Controller
using CbrnAlertApp.FlexpartController
using JSONWebTokens
using StructTypes
using UUIDs
using YAML

using SwagUI

using SearchLight
using CbrnAlertApp.Users


Genie.config.websockets_server = true
for user in SearchLight.all(User)
    Genie.Assets.channels_subscribe(user.email)
end

api_routes = Dict(
    "/forecast/available" => (f=Atp45Controller.available_steps, keyargs=(method=GET,)),
    "/atp45/containers" => (f=Atp45Controller.get_container, keyargs=(method=GET,)),
    "/atp45/procedures" => (f=Atp45Controller.get_procedure, keyargs=(method=GET,)),
    "/atp45/incidents" => (f=Atp45Controller.get_incident, keyargs=(method=GET,)),
    "/atp45/run/wind" => (f=Atp45Controller.run_wind, keyargs=(method=POST,)),
    "/atp45/run/forecast" => (f=Atp45Controller.run_forecast, keyargs=(method=POST,)),
    # "/flexpart/meteo_data_request" => (f=FlexpartController.meteo_data_request, keyargs=(method=POST, named=:meteo_data_request)),
    "/flexpart/input" => (f=FlexpartController.data_retrieval, keyargs=(method=POST,)),
    "/flexpart/inputs" => (f=FlexpartController.get_inputs, keyargs=(method=GET,)),
    "/flexpart/run" => (f=FlexpartController.run, keyargs=(method=POST,)),
    "/flexpart/runs" => (f=FlexpartController.get_runs, keyargs=(method = GET,)),
    "/flexpart/runs/:runId::String" => (f=FlexpartController.get_run, keyargs=(method = GET,)),
    "/flexpart/runs/:runId::String/outputs" => (f=FlexpartController.get_outputs, keyargs=(method = GET,)),
    "/flexpart/outputs/:outputId::String" => (f=FlexpartController.get_output, keyargs=(method = GET,)),
    "/flexpart/outputs/:outputId::String/layers/" => (f=FlexpartController.get_layers, keyargs=(method = GET,)),
    "/flexpart/outputs/:outputId::String/dimensions/" => (f=FlexpartController.get_dimensions, keyargs=(method = GET,)),
    "/flexpart/outputs/:outputId::String/slice/" => (f=FlexpartController.get_slice, keyargs=(method = POST,)),
)

for (url, args) in api_routes
    route("/api"*url; args[:keyargs]...) do
        # AuthenticationController.@authenticated!
        args[:f]()
    end
end

route("/docs") do 
    swagger_document = YAML.load_file("api_docs.yaml"; dicttype=Dict{String, Any})
    render_swagger(swagger_document)
end

route("/login", AuthenticationController.login, method = POST)
