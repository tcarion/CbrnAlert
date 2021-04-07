module FlexpartController

using Genie.Renderer.Html, Genie.Requests
using ViewHelper
using FlexFiles

const PYTHON_PATH = "/opt/anaconda3/bin/python"
# const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_app"
const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_v7.1.2"
const FLEX_EXTRACT_CONTROL = "CONTROL_OD.OPER.FC.eta.highres.app"
const FLEX_EXTRACT_RUN_PATH = joinpath(FLEX_EXTRACT_PATH, "Run")
const FLEX_EXTRACT_SOURCE_PYTHON_PATH = joinpath(FLEX_EXTRACT_PATH, "Source", "Python")
const FLEX_EXTRACT_CONTROL_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "Control", FLEX_EXTRACT_CONTROL)
const FLEX_EXTRACT_EXEC_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "run_local.sh")
const FLEX_EXTRACT_SUBMIT_PATH = joinpath(FLEX_EXTRACT_SOURCE_PYTHON_PATH, "submit.py")

function run_flexextract(output_path, params)
    cmd = `$PYTHON_PATH $FLEX_EXTRACT_SUBMIT_PATH $params`
    # cmd = `test/sleeping_script.sh`
    log_file = open(joinpath(output_path, "output_log.log"), "w")
    println("START RUNNING $(cmd)")
    process = open(cmd)
    while !eof(process)
        line = readline(process, keep=true)
        write(log_file, line) 
        flush(log_file)
    end

    if process.exitcode == 1
        throw(ProcessFailedException(process))
    end
    close(process)
    close(log_file)
end

function extract_met_data()
    html(:flexpart, "extract_met_data.jl.html", context=@__MODULE__, layout=:app)
end

function flexextract_request()
    request_data = jsonpayload()

    startdate = request_data["startdate"]
    enddate = request_data["enddate"]
    starttime = request_data["starttime"]
    endtime = request_data["endtime"]
    timestep = request_data["timestep"]
    gridres = request_data["gridres"]
    area = replace(request_data["area"], "/" => "_")

    dir_name = startdate * "_" * starttime * "_" * area
    dir_path = joinpath(pwd(), "public", "extracted_met_data", dir_name)
    mkpath(dir_path)

    formated_options = FlexFiles.flexextract_options(request_data)
    FlexFiles.update_flexfile(FLEX_EXTRACT_CONTROL_PATH, formated_options, " ", inplace=true)

    formated_exec = Dict("inputdir" => dir_path, "outputdir" => dir_path, "controlfile" => FLEX_EXTRACT_CONTROL)
    params = []
    for (k, v) in formated_exec 
        push!(params, "--$k") 
        push!(params, v)
    end
    
    try
        run_flexextract(dir_path, params)
    catch e
        error(e)
    end
end
end
