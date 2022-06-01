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
    map(lines) do line
        if occursin("DATA_NOT_YET_AVAILABLE", line)
            throw(MarsDataNotAvailableError())
        elseif occursin("ERROR", line)
            throw(UnknownMarsError())
        end
    end
    return 0
end

function meteo_data_request()
    payload = Genie.Requests.jsonpayload()
    startdate = Dates.DateTime(payload["startDate"][1:22])
    enddate = Dates.DateTime(payload["endDate"][1:22])
    timestep = payload["timeStep"]
    gridres = payload["gridRes"]
    area = payload["area"]
    area = round_area(area)
    area_str = join(convert.(Int, area .|> round), "_")
    ws_info = payload["ws_info"]

    dir_name = Dates.format(startdate, "yyyymmdd_HHMM") * "_" * area_str
    dir_path = joinpath(EXTRACTED_WEATHER_DATA_DIR, dir_name)

    newinput = FlexpartInputs.create(dir_path)
    FlexpartInputs.assign_to_user!(current_user(), newinput)
    fcontrol = FeControl(fedir)
    fcontrol[:GRID] = gridres
    fcontrol[:REQUEST] = 0
    set_area!(fcontrol, area)
    set_steps!(fcontrol, startdate, enddate, timestep)

    FlexExtract.write(fcontrol)

    log_file_path = joinpath(fedir.path, "output_log.log")
    FlexpartInputs.change_status(newinput.name, ONGOING)
    open(log_file_path, "w") do log_file
        FlexExtract.submit(fedir) do stream
            log_and_broadcast(stream, ws_info, log_file)
        end
    end

    try
        _check_mars_errors(log_file_path)
        FlexpartInputs.change_status(newinput.name, FINISHED)
    catch e
        FlexpartInputs.change_status(newinput.name, ERRORED)
        if e isa MarsDataNotAvailableError
            return DATA_NOT_YET_AVAILABLE
        elseif e isa UnknownMarsError
            return UNKNOWN_MARS_ERROR
        end
    end
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
function flexpart_run()
    debug()
    request_data = Genie.Requests.jsonpayload()
    startdate = Dates.DateTime(request_data["startDate"][1:22])
    enddate = Dates.DateTime(request_data["endDate"][1:22])
    releasestartdate = Dates.DateTime(request_data["releaseStartDate"][1:22])
    releaseenddate = Dates.DateTime(request_data["releaseEndDate"][1:22])
    releaseheight = request_data["releaseHeight"]
    timestep = request_data["timeStep"]
    # gridres = Base.parse(Float64, request_data["gridRes"])
    gridres = 0.005
    # area = request_data["area"]
    # area = area isa Dict ? area : Base.copy(area)
    area = [51., -3, 44., 9.]
    rel_lon = request_data["lon"]
    rel_lat = request_data["lat"]
    particules = request_data["particulesNumber"]
    input_name = request_data["name"]
    mass = request_data["mass"]

    fprun = FlexpartRuns.create()
    fpdir = Flexpart.FlexpartDir(fprun.path)

    fpoptions = FlexpartOption(fpdir)

    command_options = Dict(
        :IBDATE => Dates.format(startdate, "yyyymmdd"),
        :IBTIME => Dates.format(startdate, "HHMMSS"),
        :IEDATE => Dates.format(enddate, "yyyymmdd"),
        :IETIME => Dates.format(enddate, "HHMMSS"),
        :IOUT => 9
         )
    Flexpart.merge!(fpoptions["COMMAND"][:COMMAND], command_options)

    releases_options = Dict(
        :IDATE1 => Dates.format(releasestartdate, "yyyymmdd"),
        :ITIME1 => Dates.format(releasestartdate, "HHMMSS"),
        :IDATE2 => Dates.format(releaseenddate, "yyyymmdd"),
        :ITIME2 => Dates.format(releaseenddate, "HHMMSS"),
        :LON1 => rel_lon,
        :LON2 => rel_lon,
        :LAT1 => rel_lat,
        :LAT2 => rel_lat,
        :Z1 => releaseheight,
        :Z2 => releaseheight,
        :PARTS => particules,
        :MASS => mass
    )
    Flexpart.merge!(fpoptions["RELEASES"][:RELEASE], releases_options)

    Flexpart.merge!(fpoptions["OUTGRID"][:OUTGRID], Flexpart.area2outgrid(area, gridres))

    
    fedirpath = joinpath(EXTRACTED_WEATHER_DATA_DIR, input_name)
    fedir = _find_control_path(fedirpath)
    
    fpdir[:input] = fedir[:output]
    
    avs = Available(fpdir)
    
    Flexpart.write(fpoptions)
    Flexpart.write(avs)
    Flexpart.write(fpdir)

    Flexpart.remove_unused_species!(fpoptions)
    FlexpartRuns.change_options(fprun.name, fpoptions)
    open(joinpath(fpdir.path, "output.log"), "w") do logf
        FlexpartRuns.change_status(fprun.name, ONGOING)
        Flexpart.run(fpdir) do stream
            log_and_broadcast(stream, request_data["ws_info"], logf)
        end
    end

    if _iscompleted(fpdir)
        FlexpartRuns.change_status(fprun.name, FINISHED)
        FlexpartRuns.assign_to_user!(current_user(), fprun)

        outfiles = Flexpart.OutputFiles(fpdir)
        for outfile in outfiles
            fpoutput = FlexpartOutputs.add(outfile)
            FlexpartOutputs.assign_to_run!(fprun.uuid, fpoutput)
        end
    else
        # @warn "Flexpart run failed"
        FlexpartRuns.change_status(fprun.name, ERRORED)
        if ENV["GENIE_ENV"] == "prod"
            rm(fpdir.path, recursive = true)
        end
        return FLEXPART_RUN_FAILED
    end

    return fprun |> json
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

function _get_run(id)
    fprun = findone(FlexpartRun, uuid = id)
    fprun
end
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

end
