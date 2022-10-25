module FlexpartController
using Genie
using Genie.Requests
using Genie.Renderer.Json: json
using Dates
using GeoJSON
using GeoInterface
using AuthenticationController: current_user
using AuthenticationController
using Flexpart
using Flexpart.FlexExtract
using Rasters

using ColorSchemes
using Colors


using Users
using FlexpartRuns
using FlexpartInputs
using FlexpartOutputs
using SharedModels

using SearchLight
using SearchLight.Relationships

const DATE_FORMAT = "yyyy-mm-ddTHH:MM:SS"

const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")
const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

const DEFAULT_COLOR_SCHEME = ColorSchemes.jet

const CONTROL_FILE_NAME = "CONTROL_OD.OPER.FC.eta.highres.app"

const DATA_NOT_YET_AVAILABLE = Genie.Router.error(500, "Mars Retrieval error: DATA_NOT_YET_AVAILABLE", "application/json", error_info="The data you're requesting is not yet available")
const UNKNOWN_MARS_ERROR = Genie.Router.error(500, "Mars Retrieval error: Unknown", "application/json", error_info="Unknown error during data retrieval")
const FLEXPART_RUN_FAILED = Genie.Router.error(500, "Flexpart run failed", "application/json", error_info="Flexpart run failed")

struct MarsDataNotAvailableError <: Exception end

struct UnknownMarsError <: Exception end

global DEBUG_PAYLOAD_FP = 0
debug() = global DEBUG_PAYLOAD_FP = Genie.Requests.jsonpayload()

function round_area(area)
    return [ceil(area[1]), floor(area[2]), floor(area[3]), ceil(area[4])]
end

"""
    log_and_broadcast(stream, ws_info, log_file::IO)
Write the `stream` to a `log_file` stream and broadcast it the WebChannel given by `ws_info`
"""
function log_and_broadcast(stream, ws_info, log_file::IO)
    line = readline(stream, keep=true)
    to_send = Dict(:displayed => line, :backid => ws_info["backid"])
    Genie.WebChannels.broadcast(ws_info["channel"], "flexpart", to_send)
    Base.write(log_file, line)
    flush(log_file)
end

function _user_related(model::Type{<:AbstractModel})
    related(current_user(), model)
end

function _check_mars_errors(filepath)
    lines = readlines(filepath)
    haserror = false
    map(lines) do line
        if occursin("DATA_NOT_YET_AVAILABLE", line)
            throw(MarsDataNotAvailableError())
        end
        if occursin("ERROR", line)
            haserror = true
        end
    end
    haserror && throw(UnknownMarsError())
    return haserror
end

# function meteo_data_request()
#     payload = Genie.Requests.jsonpayload()
#     startdate = Dates.DateTime(payload["startDate"][1:22])
#     enddate = Dates.DateTime(payload["endDate"][1:22])
#     timestep = payload["timeStep"]
#     gridres = payload["gridRes"]
#     area = payload["area"]
#     area = round_area(area)
#     area_str = join(convert.(Int, area .|> round), "_")
#     ws_info = payload["ws_info"]

#     dir_name = Dates.format(startdate, "yyyymmdd_HHMM") * "_" * area_str
#     dir_path = joinpath(EXTRACTED_WEATHER_DATA_DIR, dir_name)

#     newinput = FlexpartInputs.create(dir_path)
#     FlexpartInputs.assign_to_user!(current_user(), newinput)
#     fcontrol = FeControl(fedir)
#     fcontrol[:GRID] = gridres
#     fcontrol[:REQUEST] = 0
#     set_area!(fcontrol, area)
#     set_steps!(fcontrol, startdate, enddate, timestep)

#     FlexExtract.write(fcontrol)

#     log_file_path = joinpath(fedir.path, "output_log.log")
#     FlexpartInputs.change_status(newinput.name, ONGOING)
#     open(log_file_path, "w") do log_file
#         FlexExtract.submit(fedir) do stream
#             log_and_broadcast(stream, ws_info, log_file)
#         end
#     end

#     try
#         _check_mars_errors(log_file_path)
#         FlexpartInputs.change_status(newinput.name, FINISHED)
#     catch e
#         FlexpartInputs.change_status(newinput.name, ERRORED)
#         if e isa MarsDataNotAvailableError
#             return DATA_NOT_YET_AVAILABLE
#         elseif e isa UnknownMarsError
#             return UNKNOWN_MARS_ERROR
#         end
#     end
# end

function data_retrieval()
    payload = Genie.Requests.jsonpayload()
    start_date = payload["start"] |> DateTime
    end_date = payload["end"] |> DateTime
    area = round_area(_area(payload["area"]))
    gridres = payload["gridres"]
    time_step = convert(Int64, payload["timeStep"] / 3600)

    newinput, fedir = FlexpartInputs.create()
    FlexpartInputs.assign_to_user!(current_user(), newinput)
    fcontrol = FeControl(fedir)
    fcontrol[:GRID] = gridres
    fcontrol[:REQUEST] = 0
    set_area!(fcontrol, area)
    set_steps!(fcontrol, start_date, end_date, time_step)

    FlexExtract.write(fcontrol)

    FlexpartInputs.change_control(newinput.uuid, fcontrol)
    FlexpartInputs.change_status(newinput.uuid, ONGOING)
    log_file_path = joinpath(fedir.path, "output_log.log")
    open(log_file_path, "w") do logf
        try 
            FlexExtract.submit(fedir) do stream
                # log_and_broadcast(stream, ws_info, log_file)
                line = readline(stream, keep=true)
                Base.write(logf, line)
                flush(logf)
            end
        catch
            FlexpartInputs.change_status(newinput.uuid, ERRORED)
            rethrow()
        end
    end

    try
        _check_mars_errors(log_file_path)
        FlexpartInputs.change_status(newinput.uuid, FINISHED)
    catch e
        FlexpartInputs.change_status(newinput.uuid, ERRORED)
        if e isa MarsDataNotAvailableError
            # throw(Genie.Exceptions.RuntimeException("Mars Retrieval error: DATA_NOT_YET_AVAILABLE", "The data you're requesting is not yet available", 500, e))
            return DATA_NOT_YET_AVAILABLE
        elseif e isa UnknownMarsError
            # throw(Genie.Exceptions.RuntimeException("Mars Retrieval error: Unknown", "Unknown error during data retrieval", 500, e))
            return UNKNOWN_MARS_ERROR
        else
            throw(e)
        end
    end

    return Dict(newinput) |> json
end

function _find_control_path(fedirpath)::FlexExtractDir
    fefiles = readdir(fedirpath, join=true)
    i = findfirst(x -> occursin("CONTROL", x), fefiles)
    FlexExtractDir(fedirpath, fefiles[1])
end
function _clarify_control(fcontrol)
    startday = Dates.DateTime(fcontrol[:START_DATE], dateformat"yyyymmdd")
    times = Base.parse.(Int, split(fcontrol[:TIME], " "))
    steps = Base.parse.(Int, split(fcontrol[:STEP], " "))
    gridres = Base.parse(Float32, fcontrol[:GRID])
    timestep = steps[2] - steps[1]
    area = [
        fcontrol[:UPPER],
        fcontrol[:LEFT],
        fcontrol[:LOWER],
        fcontrol[:RIGHT]
    ]
    area = Base.parse.(Float32, area)

    startdate = startday + Dates.Hour(times[1])
    enddate = startday + Dates.Hour((length(times) - 1) * timestep)

    return Dict(
        :startDate => startdate,
        :endDate => enddate,
        :gridRes => gridres,
        :timeStep => timestep,
        :area => area
    )
end

function get_inputs()
    fpinputs = _user_related(FlexpartInput)
    filter!(FlexpartInputs.isfinished, fpinputs)
    # metdata_dirs = [input.path for input in fpinputs]
    # names = [input.name for input in fpinputs]
    # fedirs = _find_control_path.(metdata_dirs)
    # fcontrols = FeControl.(fedirs)
    # clarified_controls = _clarify_control.(fcontrols)
    # response = map(zip(clarified_controls, names)) do (c, n)
    #     push!(c, :name => n)
    # end
    response = Dict.(fpinputs)
    return response |> json
end

function _iscompleted(fpdir)
    lines = readlines(joinpath(fpdir.path, "output.log"))
    any(occursin.("CONGRATULATIONS", lines))
end

function run()
    runtype = Genie.Router.params(:runType, "simple")

    if runtype == "simple"
        run_simple() 
    else
        run_detailed()
    end
end

function run_simple()
    debug()
    payload = Genie.Requests.jsonpayload()
    input_id = Genie.Router.params(:inputId)

    # COMMAND options
    sim_start = DateTime(payload["command"]["start"])
    sim_end = DateTime(payload["command"]["end"])
    time_step = payload["command"]["timeStep"]
    output_type = payload["command"]["outputType"]

    # RELEASE options
    release_start = DateTime(payload["releases"][1]["start"])
    release_end = DateTime(payload["releases"][1]["end"])
    lon, lat = values(payload["releases"][1]["location"])
    release_mass = payload["releases"][1]["mass"]
    release_height = payload["releases"][1]["height"]

    # OUTGRID options
    gridres = payload["outgrid"]["gridres"]
    area = payload["outgrid"]["area"]
    heights = payload["outgrid"]["heights"]

    fprun = FlexpartRuns.create()
    fpdir = Flexpart.FlexpartDir(fprun.path)

    fpoptions = FlexpartOption(fpdir)
    Flexpart.remove_unused_species!(fpoptions)

    # Set simulation start and end
    # TODO: update to set_cmd_dates! when new version available
    Flexpart.set_cmd_with_dates!(fpoptions, sim_start, sim_end)

    cmd = Dict(
        # Set simulation step
        :LOUTSTEP => time_step,
        :LOUTAVER => time_step,
        :LOUTSAMPLE => convert(Int64, time_step / 4),
        :LSYNCTIME => convert(Int64, time_step / 4),
        # Set netcdf output
        :IOUT =>  output_type + 8
    )
    merge!(fpoptions["COMMAND"][:COMMAND], cmd)

    # Set release options
    Flexpart.set_point_release!(fpoptions, lon, lat)
    releases_options = Dict(
        :IDATE1 => Dates.format(release_start, "yyyymmdd"),
        :ITIME1 => Dates.format(release_start, "HHMMSS"),
        :IDATE2 => Dates.format(release_end, "yyyymmdd"),
        :ITIME2 => Dates.format(release_end, "HHMMSS"),
        :Z1 => release_height,
        :Z2 => release_height,
        :PARTS => Flexpart.MAX_PARTICLES,
        :MASS => release_mass
    )
    Flexpart.merge!(fpoptions["RELEASES"][:RELEASE], releases_options)

    # Set outgrid options
    area_f = _area(area)
    outgrid = Flexpart.area2outgrid(area_f, gridres)
    Flexpart.merge!(fpoptions["OUTGRID"][:OUTGRID], outgrid)
    fpoptions["OUTGRID"][:OUTGRID][:OUTHEIGHTS] = join(heights, ", ")
    
    # Save the options
    Flexpart.write(fpoptions)

    # Get the input and adapt the Available file
    fpinput = findone(FlexpartInput, uuid = input_id)
    fpdir[:input] = abspath(joinpath(fpinput.path, "output"))
    avs = Available(fpdir)

    # Save the available file and the flexpart paths
    Flexpart.write(avs)
    Flexpart.write(fpdir)


    return run(fpdir, fprun) |> json
end

function run_detailed()
    debug()
end

function run(fpdir::FlexpartDir, fprun::FlexpartRun)
    fpoptions = FlexpartOption(fpdir)
    Flexpart.remove_unused_species!(fpoptions)
    FlexpartRuns.change_options(fprun.name, fpoptions)
    open(joinpath(fpdir.path, "output.log"), "w") do logf
        FlexpartRuns.change_status(fprun.name, ONGOING)
        Flexpart.run(fpdir) do stream
            # log_and_broadcast(stream, request_data["ws_info"], logf)
            line = readline(stream, keep=true)
            Base.write(logf, line)
            flush(logf)
        end
    end

    if _iscompleted(fpdir)
        FlexpartRuns.change_status(fprun.name, FINISHED)
    else
        @warn "Flexpart run failed"
        FlexpartRuns.change_status(fprun.name, ERRORED)
        if ENV["GENIE_ENV"] == "prod"
            rm(fpdir.path, recursive = true)
        end
        return FLEXPART_RUN_FAILED
    end

    FlexpartRuns.assign_to_user!(current_user(), fprun)

    outfiles = Flexpart.OutputFiles(fpdir)
    for outfile in outfiles
        fpoutput = FlexpartOutputs.add(outfile)
        FlexpartOutputs.assign_to_run!(fprun.uuid, fpoutput)
    end

    return fprun
end

Base.Dict(x::FlexpartRun) = Dict(
    :type => "flexpartResultId",
    :uuid => x.uuid,
    :name => x.name,
    :status => x.status,
    :date_created => x.date_created,
    :options => FlexpartRuns.get_options(x)
)

function get_runs()
    fpruns = _user_related(FlexpartRun)
    filter!(FlexpartRuns.isfinished, fpruns)
    Dict.(fpruns) |> json
end

_get_run(id) = findone(FlexpartRun, uuid = id)

function get_run()
    id = Genie.Router.params(:runId)
    fprun = _get_run(id)
    AuthenticationController.@hasaccess!(fprun)
    Dict(fprun) |> json
end

function _output_by_uuid()
    output_id = Genie.Router.params(:outputId)
    @show output_id
    findone(FlexpartOutput, uuid = output_id)
end

function get_outputs()
    run_id = Genie.Router.params(:runId)
    outputs = related(_get_run(run_id), FlexpartOutput)
    Dict.(outputs) |> json
end

function get_output()
    output_id = Genie.Router.params(:outputId)
    outfile = findone(FlexpartOutput, uuid = output_id)
    Dict(outfile) |> json
end

function get_layers()
    output_id = Genie.Router.params(:outputId)
    outfile = findone(FlexpartOutput, uuid = output_id)
    stack = RasterStack(outfile.path)
    layers = keys(stack)
    
    isspatial = Base.parse(Bool, Genie.Router.params(:spatial, "false"))

    if isspatial
        layers = filter(layers) do layer
            dimnames = name.(dims(stack[layer]))
            return (:X in dimnames) && (:Y in dimnames)
        end
    end
    layers |> json
end

_dims_to_dict(raster) = Dict(name(d) => collect(d) for d in dims(raster))

function get_dimensions()
    output_id = Genie.Router.params(:outputId)
    layername = Genie.Router.params(:layer, "")
    withhoriz = Base.parse(Bool, Genie.Router.params(:horizontal, "false"))
    outfile = findone(FlexpartOutput, uuid = output_id)
    raster = RasterStack(outfile.path)
    if layername !== ""
        raster = raster[layername]
    end
    d = _dims_to_dict(raster)
    if !withhoriz
        pop!(d, :X)
        pop!(d, :Y)
    end
    d |> json
end

function _to_dim(k, v)
    if k == "Time"
        Ti(At(DateTime(v)))
    elseif k == "X"
        X(At(v))
    elseif k == "Y"
        Y(At(v))
    else
        Dim{Symbol(k)}(At(v))
    end
end

function _slice(path::String, layerName, zdims)
    # layerName = "spec001_mr"
    raster = Raster(path, name = layerName)
    args = [_to_dim(dname, val) for (dname, val) in zdims]
    view(raster, args...)
end
function get_slice()
    debug()
    pl = jsonpayload()
    fpoutput = _output_by_uuid()
    layerName = Genie.Router.params(:layer)
    to_geojson = Genie.Router.params(:geojson, "false")
    to_geojson = Base.parse(Bool, to_geojson)
    viewed = _slice(fpoutput.path, layerName, pl)

    if to_geojson
        collection = to_geointerface(viewed)
        result = Dict{Symbol, Any}(:collection => geo2dict(collection))
        withcolors = Base.parse(Bool, Genie.Router.params(:legend, "false"))
        if withcolors
            result[:metadata] = getcolors(collection)
        end
        result |> json
    else
        viewed |> read |> json
    end
end


function to_geointerface(raster)
    if !hasdim(raster, X) || !hasdim(raster, Y) || ndims(raster) !== 2
        error("The remaining dimensions must be spatial")
    end
    dx = step(dims(raster, :X))
    dy = try
        step(dims(raster, :Y))
    catch
        dims(raster, :Y)[2] - dims(raster, :Y)[1]
    end

    features = Feature[]
    read_raster = read(raster) # we get the raster into memory for faster access to the values
    for I in eachindex(raster)
        fval = read_raster[I]
        if !(fval ≈ 0.)
            i,j = Tuple(I)
            poly = coords_to_polygon(raster, i, j, dx, dy)
            push!(features,
                Feature(poly,
                    Dict(
                        "val" => fval,
                    )
                )
            )
        end
    end
    FeatureCollection(features)
end

function coords_to_polygon(raster, i, j, dx, dy)
    x = dims(raster)[1][i]
    y = dims(raster)[2][j]
    x, y = convert.(Float64, [x, y])
    dx2 = dx/2
    dy2 = dy/2

    left = x - dx2; right = x + dx2; lower = y - dy2; upper = y + dy2

    Polygon([
        [left, lower],
        [left, upper],
        [right, upper],
        [right, lower],
    ])
end

function getcolors(collection)
    vals = [f.properties["val"] for f in collection.features]
    minval = minimum(vals)
    maxval = maximum(vals)
    ticks = range(minval, maxval, length=10)
    cbar = get(DEFAULT_COLOR_SCHEME, ticks[2:end], :extrema)
    Dict(
        :colors => '#'.*hex.(cbar),
        :ticks => ticks 
    )
end

_area(area) = [
    area["top"],
    area["left"],
    area["bottom"],
    area["right"],
    ]
end
