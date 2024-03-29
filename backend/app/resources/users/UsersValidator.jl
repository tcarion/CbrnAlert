module UsersValidator

using SearchLight, SearchLight.Validation, SearchLight.QueryBuilder

function not_empty(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
  isempty(getfield(m, field)) && return ValidationResult(invalid, :not_empty, "should not be empty")

  ValidationResult(valid)
end

# function unique(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
#   ispersisted(m) && return ValidationResult(valid) # don't validate updates

#   if SearchLight.count(typeof(m), where("$field = ?", getfield(m, field))) > 0
#     return ValidationResult(invalid, :unique, "is already used")
#   end

#   ValidationResult(valid)
# end

function is_unique(field::Symbol, m::T, args::Vararg{Any})::ValidationResult where {T<:AbstractModel}
  samename = findone(typeof(m); NamedTuple(field => getfield(m, field))...)
  samename === nothing || samename.id == m.id ||
      return ValidationResult(invalid, :is_unique, "already exists")

  ValidationResult(valid)
end


end