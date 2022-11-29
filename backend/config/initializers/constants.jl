const PRK_PATH = joinpath(pwd(), "config", "private.pem")
const PUK_PATH = joinpath(pwd(), "config", "public.pem")

const API_DOC_FILE = joinpath(pwd(), "api_docs.yaml")

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

const CREATED="created" 
const FINISHED="finished"
const ONGOING="ongoing"
const ERRORED="errored"

## Exceptions
# const UNAUTHORIZED = Genie.Exceptions.RuntimeException("Not authorized", "No authorization has been provided", 401)
# const FORBIDDEN = Genie.Exceptions.RuntimeException("Forbidden", "You have not access to this resource.", 403)
const UNAUTHORIZED = Genie.Exceptions.ExceptionalResponse(
    Genie.Router.error(401, "Unauthorized", MIME"application/json"; error_info = "No authorization has been provided")
    )
const FORBIDDEN = Genie.Exceptions.ExceptionalResponse(
    Genie.Router.error(403, "Forbidden", MIME"application/json"; error_info = "You have not access to this resource.")
    )