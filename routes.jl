using Genie.Router, Genie.Requests
using ATPController

route("/", ATPController.preloaded_data, named = :preloaded_data)

route("/load/:file::String", ATPController.preloaded_data, named = :preloaded_data_picked)

route("/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp_shape_request", ATPController.atp_shape_request, method = POST, named = :atp_shape_request)

route("/archive_request", ATPController.archive_request, method = POST, named = :archive_request)
