module FlexpartsController
using Genie.Renderer.Html, Genie.Requests
using GenieAuthentication
using ViewHelper
using FlexFiles
using JSON
using Dates
using ReadNcf

const PYTHON_PATH = "/opt/anaconda3/bin/python"
# const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_app"
const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_v7.1.2"
const FLEX_EXTRACT_CONTROL = "CONTROL_OD.OPER.FC.eta.highres.app"
const FLEX_EXTRACT_RUN_PATH = joinpath(FLEX_EXTRACT_PATH, "Run")
const FLEX_EXTRACT_SOURCE_PYTHON_PATH = joinpath(FLEX_EXTRACT_PATH, "Source", "Python")
const FLEX_EXTRACT_CONTROL_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "Control", FLEX_EXTRACT_CONTROL)
const FLEX_EXTRACT_EXEC_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "run_local.sh")
const FLEX_EXTRACT_SUBMIT_PATH = joinpath(FLEX_EXTRACT_SOURCE_PYTHON_PATH, "submit.py")

FLEXPART_RUN_TEMPLATE_PATH = "/home/tcarion/flexpart/flexpart_run_template_tests"

function round_area(area)
    return [ceil(area[1]), floor(area[2]), floor(area[3]), ceil(area[4])]
end

function run_flexextract(output_path, params, ws_info)
    cmd = `$PYTHON_PATH $FLEX_EXTRACT_SUBMIT_PATH $params`
    # cmd = `test/sleeping_script.sh`
    log_file = open(joinpath(output_path, "output_log.log"), "w")
    println("START RUNNING $(cmd)")
    process = open(cmd)
    while !eof(process)
        line = readline(process, keep=true)
        Genie.WebChannels.broadcast(ws_info["channel"], Dict(:displayed => line, :backid => ws_info["backid"]))
        write(log_file, line) 
        flush(log_file)
    end

    if process.exitcode == 1
        throw(ProcessFailedException(process))
    end
    close(process)
    close(log_file)
end

function flexextract_request()
    request_data = jsonpayload()
    startdate = Dates.DateTime(request_data["startDate"][1:22])
    enddate = Dates.DateTime(request_data["endDate"][1:22])
    timestep = request_data["timeStep"]
    gridres = request_data["gridRes"]
    area = request_data["areaToRetrieve"]
    area = round_area(area)

    area_str = join(convert.(Int, area .|> round), "_")

    dir_name = Dates.format(startdate, "yyyymmdd_HHMM") * "_" * area_str
    dir_path = joinpath(pwd(), "public", "extracted_met_data", dir_name)
    mkpath(dir_path)
    inputdir = joinpath(dir_path, "input")
    outputdir = joinpath(dir_path, "output")
    mkpath(inputdir)
    mkpath(outputdir)

    options = Dict(
        :startdate => startdate,
        :enddate => enddate,
        :timestep => timestep,
        :gridres => gridres,
        :area => area,
    )

    formated_options = FlexFiles.flexextract_options(options)

    open(joinpath(dir_path, "metadata.json"), "w") do f
        options[:area] = join(options[:area], ", ")
        JSON.print(f, options)
    end

    @show formated_options

    ctrl_file_path = FlexFiles.update_flexfile(FLEX_EXTRACT_CONTROL_PATH, formated_options, "controlfile", dest=dir_path)

    formated_exec = Dict("inputdir" => inputdir, "outputdir" => outputdir, "controlfile" => ctrl_file_path)
    params = []
    for (k, v) in formated_exec 
        push!(params, "--$k") 
        push!(params, v)
    end
    
    run_flexextract(dir_path, params, request_data["ws_info"])

end

end
