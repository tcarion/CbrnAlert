module FlexpartController

using Genie.Renderer.Html, Genie.Requests
using GenieAuthentication
using ViewHelper
using FlexFiles
using JSON
using Dates
using ReadNcf

before() =  authenticated() || throw(ExceptionalResponse(redirect(:show_login)))

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
# FLEXPART_BIN = "/home/tcarion/spack/opt/spack/linux-centos7-cascadelake/gcc-10.2.0/flexpart-10.4-dbpymnuxr5hxus634hcbz46dshjr5bxi/bin/FLEXPART"

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

function run_flexpart(run_dir_path)
    cur_dir = pwd()
    cd(run_dir_path)
    cmd = `FLEXPART`
    process = open(cmd)
    log_file = open(joinpath(run_dir_path, "output.log"), "w")
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
    cd(cur_dir)
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
    inputdir = joinpath(dir_path, "input")
    outputdir = joinpath(dir_path, "output")
    mkpath(inputdir)
    mkpath(outputdir)

    open(joinpath(dir_path, "metadata.json"), "w") do f
        JSON.print(f, request_data)
    end

    formated_options = FlexFiles.flexextract_options(request_data)
    ctrl_file_path = FlexFiles.update_flexfile(FLEX_EXTRACT_CONTROL_PATH, formated_options, "controlfile", dest=dir_path)

    formated_exec = Dict("inputdir" => inputdir, "outputdir" => outputdir, "controlfile" => ctrl_file_path)
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

function flexpart_preloaded()
    available_met_data_dir = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "extracted_met_data"), join=true))
    available_met_data = Array{Dict, 1}()
    for dirname in available_met_data_dir
        isfile(joinpath(dirname, "metadata.json")) || break
        open(joinpath(dirname, "metadata.json"), "r") do f
            parsed_metadata = JSON.parse(f)
            push!(available_met_data, Dict(
                :dirname => splitpath(dirname)[end], 
                :metadata => Dict(Symbol(k) => v for (k, v) in parsed_metadata),
                :json_data => replace(JSON.json(parsed_metadata), '"' => "&quot;")
                )
            )
        end
    end

    available_fp_runs_dir = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "flexpart_runs"), join=true))
    available_fp_runs = Array{Dict, 1}()
    for dirname in available_fp_runs_dir
        output_dir = joinpath(dirname, "output")
        ncf_file = filter(x->occursin(".nc",x), readdir(output_dir))[1]
        metadata = ReadNcf.ncfmetadata(joinpath(output_dir, ncf_file))
        push!(available_fp_runs, Dict(
            :dirname => splitpath(dirname)[end],
            :metadata => metadata,
            :json_data => replace(JSON.json(metadata), '"' => "&quot;")
            )
        )
    end

    html(:flexpart, "flexpart_preloaded.jl.html", context=@__MODULE__, 
        available_met_data = available_met_data, available_fp_runs = available_fp_runs,
        layout=:app)

end

function flexpart_run_request()
    request_data = jsonpayload()
    # @show request_data

    startdatetime = DateTime(split(request_data["startdatetime"], '+')[1], dateformat"y-m-dTHH:MM:SS")
    enddatetime = DateTime(split(request_data["enddatetime"], '+')[1], dateformat"y-m-dTHH:MM:SS")
    releasestartdatetime = DateTime(split(request_data["releasestartdatetime"], '+')[1], dateformat"y-m-dTHH:MM:SS")
    releaseenddatetime = DateTime(split(request_data["releaseenddatetime"], '+')[1], dateformat"y-m-dTHH:MM:SS")
    releaseheight = request_data["releaseheight"]
    timestep = request_data["timestep"]
    gridres = parse(Float32, request_data["gridres"])
    area = parse.(Float32, split(request_data["area"], "/"))
    rel_lon = request_data["lon"]
    rel_lat = request_data["lat"]
    particules = request_data["particules"]
    metdata_dirname = request_data["extracted_dirname"]

    run_dir_name = Dates.format(startdatetime, dateformat"yyyymmdd_HH")*"_"*Dates.format(enddatetime, dateformat"yyyymmdd_HH")*"_"*particules
    run_dir_path = joinpath(pwd(), "public", "flexpart_runs", run_dir_name)
    mkpath(run_dir_path)
    cp(FLEXPART_RUN_TEMPLATE_PATH, run_dir_path, force=true)

    options_dir_path = joinpath(run_dir_path, "options")

    command_options = Dict(
        "IBDATE" => Dates.format(startdatetime, "yyyymmdd"),
        "IBTIME" => Dates.format(startdatetime, "HHMMSS"),
        "IEDATE" => Dates.format(enddatetime, "yyyymmdd"),
        "IETIME" => Dates.format(enddatetime, "HHMMSS"),
        )
    
    releases_options = Dict(
        "IDATE1" => Dates.format(releasestartdatetime, "yyyymmdd"),
        "ITIME1" => Dates.format(releasestartdatetime, "HHMMSS"),
        "IDATE2" => Dates.format(releaseenddatetime, "yyyymmdd"),
        "ITIME2" => Dates.format(releaseenddatetime, "HHMMSS"),
        "LON1" => rel_lon,
        "LON2" => rel_lon,
        "LAT1" => rel_lat,
        "LAT2" => rel_lat,
        "Z1" => releaseheight,
        "Z2" => releaseheight,
        "PARTS" => particules
    )

    outlon0 = area[2]
    outlat0 = area[3]
    deltalon = area[4] - outlon0
    deltalat = area[1] - outlat0
    nx = convert(Int, deltalon/gridres)
    ny = convert(Int, deltalat/gridres)

    outgrid_options = Dict(
        "OUTLON0" => outlon0,
        "OUTLAT0" => outlat0,
        "NUMXGRID" => nx,
        "NUMYGRID" => ny,
        "DXOUT" => gridres,
        "DYOUT" => gridres
    )

    FlexFiles.update_flexfile(joinpath(options_dir_path, "COMMAND"), command_options, "namelist")
    FlexFiles.update_flexfile(joinpath(options_dir_path, "RELEASES"), releases_options, "namelist")
    FlexFiles.update_flexfile(joinpath(options_dir_path, "OUTGRID"), outgrid_options, "namelist")

    metdata_dirname = joinpath(pwd(), "public", "extracted_met_data", metdata_dirname, "output/")

    pathnames_path = joinpath(pwd(), run_dir_path, "pathnames")
    pathnames = readlines(pathnames_path)
    pathnames[3] = metdata_dirname
    open(pathnames_path, "w") do f
        for l in pathnames write(f, l*"\n") end
    end

    FlexFiles.update_available(joinpath(pwd(), run_dir_path, "AVAILABLE"), metdata_dirname)
    run_flexpart(run_dir_path)
end

function flexpart_run_output()
    sent_data = jsonpayload()
    run_name = sent_data["selected_run"]
    time = parse(Int, sent_data["time"])

    available_fp_runs = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "flexpart_runs"), join=true))
    available_fp_runs = [splitpath(x)[end] for x in available_fp_runs]

    if !(run_name in available_fp_runs)
        throw(Genie.Exceptions.RuntimeException("Flexpart run not found", "The flexpart output hasn't been found on the server", 1))
    end
    
    output_dir = joinpath(pwd(), "public", "flexpart_runs", run_name, "output")
    ncf_file = filter(x->occursin(".nc",x), readdir(output_dir))[1]
    ncf_file = joinpath(output_dir, ncf_file)
    lon, lat, conc = ReadNcf.get_filtered_field(ncf_file, time)

    return Dict("lons" => lon, "lats" => lat, "values" => log10.(conc)) |> Genie.Renderer.Json.json
end
end
