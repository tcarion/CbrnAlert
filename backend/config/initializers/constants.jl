const PRK_PATH = "config/private.pem"
const PUK_PATH = "config/public.pem"

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

const CREATED="created" 
const FINISHED="finished"
const ONGOING="ongoing"
const ERRORED="errored"