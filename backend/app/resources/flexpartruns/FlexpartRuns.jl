module FlexpartRuns

using SearchLight
import SearchLight: AbstractModel, DbId
using SearchLight.Validation
import Base: @kwdef
using Dates
using CbrnAlertApp.FlexpartValidator


export FlexpartRun

# import ..UserApp: FLEXPART_RUNS_DIR

const FLEXPART_RUNS_DIR = joinpath(pwd(), "public", "flexpart_runs")

# StructTypes.StructType(::Type{OptionType}) = StructTypes.Struct()
# StructTypes.StructType(::Type{OptionType}) = StructTypes.DictType()

# convert(::Type{Union{}}, ::AbstractString) = ""

# Base.convert(::Type{OptionType}, x::AbstractString) = JSON3.read(x, OptionType)
# Base.convert(::Type{String}, x::OptionType) = JSON3.write(x)
# Base.string(x::OptionType) = JSON3.write(x)
# Base.convert(::Type{Nothing}, ::AbstractString) = ""
# function Base.convert(::Type{Union{OptionType, Nothing}}, x::AbstractString)
#     if x == ""
#         nothing
#     else
#         JSON3.read(x)
#     end
# end

@kwdef mutable struct FlexpartRun <: AbstractModel
    id::DbId = DbId()
    uuid::String = ""
    name::String = ""
    path::String = ""
    date_created::DateTime = Dates.now()
    status::String = CREATED
    options::String = ""
    # options::OptionType = OptionType()
end

Validation.validator(::Type{FlexpartRun}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

end
