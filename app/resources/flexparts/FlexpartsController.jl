module FlexpartsController
using Genie.Renderer.Html, Genie.Requests
using GenieAuthentication
using ViewHelper
using FlexFiles
using JSON
using Dates
using ReadNcf
using GeoJSON

const PYTHON_PATH = "/opt/anaconda3/bin/python"
# const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_app"
const FLEX_EXTRACT_PATH = "/home/tcarion/flexpart/flex_extract_v7.1.2"
const FLEX_EXTRACT_CONTROL = "CONTROL_OD.OPER.FC.eta.highres.app"
const FLEX_EXTRACT_RUN_PATH = joinpath(FLEX_EXTRACT_PATH, "Run")
const FLEX_EXTRACT_SOURCE_PYTHON_PATH = joinpath(FLEX_EXTRACT_PATH, "Source", "Python")
const FLEX_EXTRACT_CONTROL_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "Control", FLEX_EXTRACT_CONTROL)
const FLEX_EXTRACT_EXEC_PATH = joinpath(FLEX_EXTRACT_RUN_PATH, "run_local.sh")
const FLEX_EXTRACT_SUBMIT_PATH = joinpath(FLEX_EXTRACT_SOURCE_PYTHON_PATH, "submit.py")

const EXTRACTED_MET_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const CONTROL_FILE_NAME = "CONTROL_OD.OPER.FC.eta.highres.app"

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

function run_flexpart(run_dir_path, ws_info)
    cur_dir = pwd()
    try
        cd(run_dir_path)
        cmd = `FLEXPART`
        log_file = open(joinpath(run_dir_path, "output.log"), "w")
        process = open(cmd)
        cd(cur_dir)
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
    catch e
        throw(e)
    finally
        cd(cur_dir)
    end
end

function flexextract_request(payload)
    request_data = payload
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

    # open(joinpath(dir_path, "metadata.json"), "w") do f
    #     # options[:area] = join(options[:area], ", ")
    #     JSON.print(f, options)
    # end

    # @show formated_options

    ctrl_file_path = FlexFiles.update_flexfile(FLEX_EXTRACT_CONTROL_PATH, formated_options, "controlfile", dest=dir_path)

    formated_exec = Dict("inputdir" => inputdir, "outputdir" => outputdir, "controlfile" => ctrl_file_path)
    params = []
    for (k, v) in formated_exec 
        push!(params, "--$k") 
        push!(params, v)
    end
    
    run_flexextract(dir_path, params, request_data["ws_info"])
end

function available_flexpart_input(payload)
    metdata_dir = readdir(EXTRACTED_MET_DATA_DIR, join=true)
    control_files = joinpath.(metdata_dir, CONTROL_FILE_NAME)
    metadata = FlexFiles.flexextract_metadata.(control_files)
    # metadata = metadata[(!).(isnothing.(metadata))]
    dirnames = map(x -> splitpath(x)[end], metdata_dir)
    
    response = Dict[]
    for (index, md) in enumerate(metadata)
        if !isnothing(md) 
            push!(md, :dataDirname => dirnames[index])
            push!(response, md)
        end
    end
    # response = [push!(x, :dataDirname => dir) for (x, dir) in zip(metadata, dirnames)]
    return response
end

function flexpart_run(payload)
    request_data = payload

    startdate = Dates.DateTime(request_data["startDate"][1:22])
    enddate = Dates.DateTime(request_data["endDate"][1:22])
    releasestartdate = Dates.DateTime(request_data["releaseStartDate"][1:22])
    releaseenddate = Dates.DateTime(request_data["releaseEndDate"][1:22])
    releaseheight = request_data["releaseHeight"]
    timestep = request_data["timeStep"]
    gridres = request_data["gridRes"]
    area = request_data["area"]
    rel_lon = request_data["lon"]
    rel_lat = request_data["lat"]
    particules = request_data["particulesNumber"]
    metdata_dirname = request_data["dataDirname"]

    area = round_area(area)

    run_dir_name = Dates.format(startdate, dateformat"yyyymmdd_HH")*"_"*Dates.format(enddate, dateformat"yyyymmdd_HH")*"_"*particules
    run_dir_path = joinpath(pwd(), "public", "flexpart_runs", run_dir_name)
    mkpath(run_dir_path)
    cp(FLEXPART_RUN_TEMPLATE_PATH, run_dir_path, force=true)

    options_dir_path = joinpath(run_dir_path, "options")

    command_options = Dict(
        "IBDATE" => Dates.format(startdate, "yyyymmdd"),
        "IBTIME" => Dates.format(startdate, "HHMMSS"),
        "IEDATE" => Dates.format(enddate, "yyyymmdd"),
        "IETIME" => Dates.format(enddate, "HHMMSS"),
        )
    
    releases_options = Dict(
        "IDATE1" => Dates.format(releasestartdate, "yyyymmdd"),
        "ITIME1" => Dates.format(releasestartdate, "HHMMSS"),
        "IDATE2" => Dates.format(releaseenddate, "yyyymmdd"),
        "ITIME2" => Dates.format(releaseenddate, "HHMMSS"),
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

    run_flexpart(run_dir_path, request_data["ws_info"])
end

"""
    flexpart_results()
Return meta data for a flexpart run

Input payload:
    none
Output:
    Dict(
        :startDate :: Date,
        :endDate :: Date
        :times :: Int[],
        :heights :: Real[],
        :area :: Real[],
        :dataDirname :: String,
    )[]
"""
function flexpart_results(payload)
    available_fp_runs_dir = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "flexpart_runs"), join=true))
    available_fp_runs = Array{Dict, 1}()
    for dir in available_fp_runs_dir
        output_dir = joinpath(dir, "output")
        ncf_file = filter(x->occursin(".nc",x), readdir(output_dir))
        isempty(ncf_file) && break
        ncf_file = ncf_file[1]
        metadata = ReadNcf.ncfmetadata(joinpath(output_dir, ncf_file))
        push!(metadata, :dataDirname => splitpath(dir)[end])
        push!(available_fp_runs, metadata)
    end
    return available_fp_runs
end

"""
    flexpart_conc()
Return meta data for a flexpart run

Input payload:
    Dict(
        :timeStep :: Int,
        :heights :: Int
        :dataDirname :: String,
    )[]
Output:
    Dict(
        :lons :: Real[],
        :lats :: Real[],
        :values :: Real[],
    )[]
"""
function flexpart_conc(payload)
    sent_data = payload
    run_name = sent_data["dataDirname"]
    time = sent_data["timeSteps"]

    available_fp_runs = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "flexpart_runs"), join=true))
    available_fp_runs = [splitpath(x)[end] for x in available_fp_runs]

    if !(run_name in available_fp_runs)
        throw(Genie.Exceptions.RuntimeException("Flexpart run not found", "The flexpart output hasn't been found on the server", 1))
    end
    
    output_dir = joinpath(pwd(), "public", "flexpart_runs", run_name, "output")
    ncf_file = filter(x->occursin(".nc",x), readdir(output_dir))[1]
    ncf_file = joinpath(output_dir, ncf_file)
    lon, lat, conc = ReadNcf.get_filtered_field(ncf_file, time)

    response = Dict("lons" => lon, "lats" => lat, "values" => log10.(conc))
    return response
end

function flexpart_geojson_conc(payload)
    sent_data = payload
    run_name = sent_data["dataDirname"]
    time = sent_data["timeSteps"]
    flexpart_result = sent_data["flexpartResult"]
    
    available_fp_runs = filter(x -> isdir(x), readdir(joinpath(pwd(), "public", "flexpart_runs"), join=true))
    available_fp_runs = [splitpath(x)[end] for x in available_fp_runs]

    if !(run_name in available_fp_runs)
        throw(Genie.Exceptions.RuntimeException("Flexpart run not found", "The flexpart output hasn't been found on the server", 1))
    end
    
    output_dir = joinpath(pwd(), "public", "flexpart_runs", run_name, "output")
    ncf_file = filter(x->occursin(".nc",x), readdir(output_dir))[1]
    ncf_file = joinpath(output_dir, ncf_file)
    cells, legend_data = ReadNcf.frame2geo_dict(ncf_file, time, flexpart_result["dx"], flexpart_result["dy"])
    fp_run_data = ReadNcf.ncfmetadata(ncf_file)

    Dict(
        "flexpartResult" => fp_run_data,
        "cells" => cells,
        "legendData" => legend_data
    )
end

end
