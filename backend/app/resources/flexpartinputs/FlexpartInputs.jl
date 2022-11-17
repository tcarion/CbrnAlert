module FlexpartInputs

import SearchLight: AbstractModel, DbId
using SearchLight.Validation
import Base: @kwdef
using CbrnAlertApp.FlexpartValidator
using Dates

export FlexpartInput

# import ..UserApp: EXTRACTED_WEATHER_DATA_DIR
const EXTRACTED_WEATHER_DATA_DIR = joinpath(pwd(), "public", "extracted_met_data")

# StructTypes.StructType(::Type{FeControl}) = StructTypes.DictType()

# Base.convert(::Type{String}, x::FeControl) = JSON3.write(x)
# Base.convert(::Type{FeControl}, x::FeControl) = JSON3.read(x, Fe)


@kwdef mutable struct FlexpartInput <: AbstractModel
    id::DbId = DbId()
    # id as uuid4
    uuid::String = ""
    # user customizable name
    name::String = ""
    # path to the FlexExtract directory
    path::String = ""
    # Control file options in JSON format
    control::String = ""
    date_created::DateTime = Dates.now()
    status::String = CREATED
end

Validation.validator(::Type{FlexpartInput}) = ModelValidator([
    ValidationRule(:uuid, FlexpartValidator.not_empty),
    ValidationRule(:uuid, FlexpartValidator.is_unique),
    ValidationRule(:path, FlexpartValidator.not_empty),
    ValidationRule(:path, FlexpartValidator.is_unique),
])

end