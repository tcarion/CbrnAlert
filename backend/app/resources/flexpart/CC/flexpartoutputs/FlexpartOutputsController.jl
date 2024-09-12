module FlexpartOutputsController

using Genie
using Genie.Requests
using Genie.Renderer.Json: json
using SearchLight
using SearchLight.Relationships

using UUIDs

using JSON3
using Dates
# using GeoJSON
using GeoJSON: Feature, FeatureCollection, Polygon, write
using GeoInterface
using Rasters
using ArchGDAL
using ColorSchemes
using Colors

using CbrnAlertApp.FlexpartRuns
using CbrnAlertApp.FlexpartOutputs

using CbrnAlertApp: TMP_DIR_PATH

const DEFAULT_COLOR_SCHEME = ColorSchemes.jet

function _output_by_uuid(output_id)
    findone(FlexpartOutput, uuid = output_id)
end

function get_outputs()
    run_id = Genie.Router.params(:runId)
    outputs = related(FlexpartRuns._get_run(run_id), FlexpartOutput)
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
    if k == "Ti"
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
    pl = jsonpayload()
    outputId = Genie.Router.params(:outputId)
    fpoutput = _output_by_uuid(outputId)
    layerName = Genie.Router.params(:layer)
    to_geojson = Genie.Router.params(:geojson, "false")
    to_geojson = Base.parse(Bool, to_geojson)
    viewed = _slice(fpoutput.path, layerName, pl)
    viewed = reverse(viewed; dims=Y)

    if to_geojson
        collection = to_geointerface(viewed)
        result = Dict{Symbol, Any}(:collection => geo2dict(collection))
        withcolors = Base.parse(Bool, Genie.Router.params(:legend, "false"))
        if withcolors
            result[:metadata] = getcolors(collection)
        end
        result |> json
    else
        _respond_tiff(viewed)
        # viewed |> read |> json
    end
end

function _respond_tiff(raster)
    filename = string(UUIDs.uuid4()) * ".tiff"
    tmpfile = joinpath(TMP_DIR_PATH, filename)
    trimed = Rasters.trim(replace(raster, 0. => nothing))
    try
        filename = Rasters.write(tmpfile, replace(trimed, nothing => 0.); options= Dict("COMPRESS"=>"DEFLATE"))
        Genie.Router.serve_file(filename)
    catch
        rethrow()
    finally
        if isfile(tmpfile)
            rm(tmpfile)
        end
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
    coords = []
    vals = []
    read_raster = read(raster) # we get the raster into memory for faster access to the values
    for I in CartesianIndices(read_raster)
        fval = read_raster[I]
        if !(fval ≈ 0.)
            i,j = Tuple(I)
            coord = cell_coords(read_raster, i, j, dx, dy)
            # feat = Feature(poly; properties = (val = fval,))
            push!(coords, coord)
            push!(vals, fval)
        end
    end

    features = map(zip(coords, vals)) do (coord, val)
        Feature(Polygon(coordinates = [coord]); properties = (val = val,))
    end

    FeatureCollection(features)
end

function cell_coords(raster, i, j, dx, dy)
    x = dims(raster)[1][i]
    y = dims(raster)[2][j]
    x, y = convert.(Float64, [x, y])
    dx2 = dx/2
    dy2 = dy/2

    left = x - dx2; right = x + dx2; lower = y - dy2; upper = y + dy2

    [
        [left, lower],
        [left, upper],
        [right, upper],
        [right, lower],
    ]
end

function getcolors(collection)
    vals = collection.val
    minval = minimum(vals)
    maxval = maximum(vals)
    ticks = range(minval, maxval, length=10)
    cbar = get(DEFAULT_COLOR_SCHEME, ticks[2:end], :extrema)
    Dict(
        :colors => '#'.*hex.(cbar),
        :ticks => ticks 
    )
end

geo2dict(collection) = JSON3.read(write(collection))

end
