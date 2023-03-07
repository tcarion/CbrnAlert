using Dates
using TimeZones

import Base.convert

convert(::Type{Int}, v::SubString{String}) = parse(Int, v)
convert(::Type{Float64}, v::SubString{String}) = parse(Float64, v)
convert(::Type{Date}, s::String) = parse(Date, s)
convert(::Type{DateTime}, s::String) = DateTime(s)
convert(::Type{TimeZones.ZonedDateTime}, d::DateTime) = ZonedDateTime(d, localzone())