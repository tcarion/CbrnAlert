const PRK_PATH = joinpath("config", "private.pem")
const PUK_PATH = joinpath("config", "public.pem")

const API_DOC_FILE = "api_docs.yaml"

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

const CREATED="created" 
const FINISHED="finished"
const ONGOING="ongoing"
const ERRORED="errored"

## Exceptions
const UNAUTHORIZED = Genie.Exceptions.RuntimeException("Not authorized", "No authorization has been provided", 401)