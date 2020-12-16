using Genie.Router, Genie.Requests
# using ReadgribController
# using PlottingController
using ATPController
import Genie.Router: @params

route("/", ATPController.preloaded_data, named = :preloaded_data)

route("/load/:file::String", ATPController.preloaded_data, named = :preloaded_data_picked)

route("/echo/:message", ATPController.echom)

route("/archive_data", ATPController.archive_data, named = :archive_data)

route("/atp_coords", ATPController.shape_coord_request, method = POST, named = :atp_coords)

route("/archive_request", ATPController.archive_request, method = POST, named = :archive_request)
