using Genie.Router, Genie.Requests
using ATPController

route("/", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction)

route("/load/:file::String", ATPController.preloaded_atp_prediction, named = :preloaded_atp_prediction_picked)

route("/realtime_atp_prediction", ATPController.realtime_atp_prediction, named = :realtime_atp_prediction)

route("/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

route("/mars_request", ATPController.mars_request, method = POST, named = :mars_request)
