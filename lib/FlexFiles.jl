module FlexFiles

using Dates

function update_flexfile(filepath::String, to_change::Dict, sep::String; inplace::Bool=false)
    (tmppath, tmpio) = mktemp()
    fields = collect(keys(to_change))
    rega = [Regex("^$(x)$(sep)") for x in fields]
    open(filepath, "r") do f
        for line in eachline(f, keep=true)
            ioc = occursin.(rega, line)
            if any(ioc)
                field = fields[ioc][1]
                line = field*sep*to_change[field]*"\n"
            end
            write(tmpio, line)
        end
    end
    close(tmpio)
    newf = inplace ? mv(tmppath, filepath, force=true) : mv(tmppath, joinpath(pwd(), basename(filepath)), force=true)
    chmod(newf, stat(filepath).mode)
end

function flexextract_options(options)
    startdate = options["startdate"]
    enddate = options["enddate"]
    starttime = options["starttime"]
    endtime = options["endtime"]
    timestep = options["timestep"]
    gridres = options["gridres"]
    area = split(options["area"], '/')
    df = "yyyy-mm-ddTHH"

    startdt = Dates.DateTime(startdate*'T'*starttime, df)
    enddt = Dates.DateTime(enddate*'T'*endtime, df)
    hour_nbr = Dates.Hour(enddt - startdt).value

    stepdt = startdt:Dates.Hour(timestep):enddt
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

    if startdt <= last_available
        if (Dates.Hour(startdt) == Hour(0) || Dates.Hour(startdt) == Hour(12))
            for (i, st) in enumerate(stepdt)
                Dates.Hour(st) == Hour(0) ? push!(type_ctrl, "AN") : push!(type_ctrl, "FC")
                push!(time_ctrl, div(Dates.Hour(st).value, 12) * 12 |> format_opt)
                push!(step_ctrl, Dates.Hour(st).value .% 12 |> format_opt)
            end

        end
    end

    Dict(
        "START_DATE" => replace(startdate, "-" =>  ""), 
        "TYPE" => join(type_ctrl, " "),
         "TIME" => join(time_ctrl, " "), 
         "STEP" => join(step_ctrl, " "), 
         "GRID" => gridres, 
         "DTIME" => timestep, 
         "LOWER" => area[3],
         "UPPER" => area[1],
         "LEFT" => area[2],
         "RIGHT" => area[4]
         )
end

function format_opt(opt::Int)
    opt < 10 ? "0$(opt)" : "$(opt)"
end

end