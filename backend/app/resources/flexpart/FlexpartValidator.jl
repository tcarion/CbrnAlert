module FlexpartValidator

using SearchLight, SearchLight.Validation

function not_empty(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
    isempty(getfield(m, field)) && return ValidationResult(invalid, :not_empty, "should not be empty")

    ValidationResult(valid)
end

function is_int(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
    isa(getfield(m, field), Int) || return ValidationResult(invalid, :is_int, "should be an int")

    ValidationResult(valid)
end

function is_unique(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
    samename = findone(typeof(m); NamedTuple(field => getfield(m, field))...)
    samename === nothing || samename.id == m.id ||
        return ValidationResult(invalid, :is_unique, "already exists")

    ValidationResult(valid)
end

end
