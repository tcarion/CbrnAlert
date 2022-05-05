module FlexFiles

export update_flexfile, update_available, flexextract_options, flexextract_metadata, namelist2dict
using Dates

function dateYY(d)
    y = Dates.year(d)
    if 80 <= y <= 99
        d+Dates.Year(1900)
    elseif 0 <= y <= 79
        d+Dates.Year(2000)
    else
        error("don't know what to do with year $d")
    end
end

function update_flexfile(filepath::String, to_change::Dict, filetype; dest::String="")
    (tmppath, tmpio) = mktemp()
    fields = collect(keys(to_change))
    reg(x) = filetype == "namelist" ? "(\\s*)($(x))(\\s*=?\\s*)([^\\s,]*)(,.*)" : "^$(x)\\s"
    rega = [Regex(reg(x)) for x in fields]
    open(filepath, "r") do f
        for line in eachline(f, keep=true)
            ioc = occursin.(rega, line)
            if any(ioc)
                field = fields[ioc][1]
                if filetype == "namelist"
                    m = match(rega[ioc][1], line)
                    line = replace(line, m.captures[4] => to_change[field])
                else
                    line = field*" "*to_change[field]*"\n"
                end
            end
            write(tmpio, line)
        end
    end
    close(tmpio)
    newf = dest=="" ? mv(tmppath, filepath, force=true) : mv(tmppath, joinpath(dest, basename(filepath)), force=true)
    chmod(newf, stat(filepath).mode)
    newf
end

function update_available(available_path::String, fe_output_path::String)
    fe_output_files = readdir(fe_output_path)
    m = [match(r"\d{8}$", file).match for file in fe_output_files]
    m_sep = [parse.(Int, [x[1:2], x[3:4], x[5:6], x[7:8]]) for x in m]
    formated_date = [DateTime(y, m, d, h) for (y, m, d, h) in m_sep]
    dates = dateYY.(formated_date)
    formated_av = [Dates.format(d, "yyyymmdd")*" "*Dates.format(d, "HHMMSS")*"      "*fn*"      "*"ON DISK" for (d, fn) in zip(dates, fe_output_files)]

    av_file = readlines(available_path)
    ioc = findall(x -> occursin("YYYYMMDD HHMMSS", x), av_file)
    new_av = av_file[1:ioc[1]]
    for l in formated_av
        push!(new_av, l)
    end
    open(available_path, "w") do f
        for l in new_av
            write(f, l*"\n")
        end
    end
end

function flexextract_options(options)
    startdate = options[:startdate]
    enddate = options[:enddate]
    timestep = options[:timestep]
    gridres = options[:gridres]
    area = options[:area]
    df = "yyyy-mm-ddTHH"

    hour_nbr = Dates.Hour(enddate - startdate).value

    stepdt = startdate:Dates.Hour(timestep):(enddate - Dates.Hour(1))
    type_ctrl = []
    time_ctrl = []
    step_ctrl = []

    today = Dates.today()
    today_midnight = Dates.DateTime(today)
    today_noon = today_midnight + Dates.Hour(12)
    yesterday_noon = today_midnight - Dates.Hour(12)

    if Dates.now() > Dates.DateTime(Dates.year(today), Dates.month(today), Dates.day(today), 18, 55)
        last_available = today_noon
    elseif Dates.now() > Dates.DateTime(Dates.year(today), Dates.month(today), Dates.day(today), 6, 55)
        last_available = today_midnight
    else
        last_available = yesterday_noon
    end

    if startdate <= last_available
        for (i, st) in enumerate(stepdt)
            push!(time_ctrl, div(Dates.Hour(st).value, 12) * 12 |> format_opt)
            step = Dates.Hour(st).value .% 12
            step == 0 ? push!(type_ctrl, "AN") : push!(type_ctrl, "FC")
            push!(step_ctrl, step |> format_opt)
        end
    end

    Dict(
        "START_DATE" => Dates.format(startdate, "yyyymmdd"), 
        "TYPE" => join(type_ctrl, " "),
        "TIME" => join(time_ctrl, " "), 
        "STEP" => join(step_ctrl, " "), 
        "GRID" => gridres isa String || string(gridres), 
        "DTIME" => timestep isa String || string(timestep), 
        "LOWER" => area[3] isa String || string(area[3]), 
        "UPPER" => area[1] isa String || string(area[1]), 
        "LEFT" => area[2] isa String || string(area[2]), 
        "RIGHT" => area[4] isa String || string(area[4]), 
        )
end

function control2dict(filepath)
    d = Dict{String, String}()
    f = open(filepath, "r")
    for line in eachline(f)
        m = match(r"^(.*?)\s(.*)", line)
        push!(d, m.captures[1] => m.captures[2])
    end
    close(f)
    return d
end

function namelist2dict(filepath)
    fieldtype = Union{String, Dict, SubString{String}}
    d = Dict{Symbol, fieldtype}()
    f = open(filepath, "r")
    header = ""
    for line in eachline(f)
        if !((m = match(r"\s*(.*?)\s*=?\s*([^\s,]*),.*", line)) |> isnothing) #captures the field name in group 1 and the value in group 2
            dict2fill = header |> isempty ? d : d[Symbol(header)]
            push!(dict2fill, m.captures[1] |> Symbol => m.captures[2])
        elseif !((m = match(r"\&(\w*)", line)) |> isnothing) #captures the name of the header in group 1
            push!(d, m.captures[1] |> Symbol => Dict{Symbol, fieldtype}())
            header = m.captures[1]
        end
    end
    close(f)
    return d
end

function flexextract_metadata(filepath)
    if !isfile(filepath) return end
    control = control2dict(filepath)
    startday = Dates.DateTime(control["START_DATE"], dateformat"yyyymmdd")
    times = parse.(Int, split(control["TIME"], " "))
    steps = parse.(Int, split(control["STEP"], " "))
    gridres = parse(Float32, control["GRID"])
    timestep = steps[2] - steps[1]
    area = [
        control["UPPER"],
        control["LEFT"],
        control["LOWER"],
        control["RIGHT"]
    ]
    area = parse.(Float32, area)

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



function format_opt(opt::Int)
    opt < 10 ? "0$(opt)" : "$(opt)"
end

end