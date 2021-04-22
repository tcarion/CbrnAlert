using Genie.Router, Genie.Requests, Genie.Assets
using ATPController
using FlexpartController
using DashboardController

Genie.config.websockets_server = true # enable the websocket server

route("/") do 
    Genie.Renderer.redirect(:dashboard) 
end

route("/dashboard", DashboardController.dashboard, named = :dashboard)

route("/atp45/load", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction)

route("/atp45/load/:file::String", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction_picked)

route("/atp45/realtime_atp_prediction", ATPController.realtime_atp_prediction, named = :realtime_atp_prediction)

route("/atp45/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp45/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

route("/atp45/mars_request", ATPController.mars_request, method = POST, named = :mars_request)

route("/flexpart/extract_met_data", FlexpartController.extract_met_data, named= :extract_met_data)

route("/flexpart/flexextract_request", FlexpartController.flexextract_request, method = POST, named= :flexextract_request)

route("/flexpart/flexpart_preloaded", FlexpartController.flexpart_preloaded, method = GET, named= :flexpart_preloaded)

route("/flexpart/flexpart_run_request", FlexpartController.flexpart_run_request, method = POST, named= :flexpart_run_request)

route("/flexpart/flexpart_run_output", FlexpartController.flexpart_run_output, method = POST, named= :flexpart_run_output)

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
