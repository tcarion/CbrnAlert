module FlexpartRuns

import SearchLight: AbstractModel, DbId
import Base: @kwdef
import Users
using Dates

export FlexpartRun

convert(::Type{Union{}}, ::AbstractString) = ""

@kwdef mutable struct FlexpartRun <: AbstractModel
    id::DbId = DbId()
    name::String = ""
    path::String = ""
    run_date::String = ""
end

end
