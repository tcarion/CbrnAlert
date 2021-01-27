using Genie.Router, Genie.Requests, Genie.Assets
using ATPController

Genie.config.websockets_server = true # enable the websocket server

route("/", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction)

route("/load/:file::String", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction_picked)

route("/realtime_atp_prediction", ATPController.realtime_atp_prediction, named = :realtime_atp_prediction)

route("/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

route("/mars_request", ATPController.mars_request, method = POST, named = :mars_request)

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
