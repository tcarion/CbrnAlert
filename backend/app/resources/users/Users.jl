module Users

using Genie
using SearchLight, SearchLight.Validation, CbrnAlertApp.UsersValidator
using SHA
using StructTypes

export User

Base.@kwdef mutable struct User <: AbstractModel
    ### FIELDS
    id::DbId = DbId()
    username::String = ""
    password::String = ""
    name::String = ""
    email::String = ""
    connections_number::Integer = 0
    connected_with_ips::String = ""
end

StructTypes.StructType(::Type{User}) = StructTypes.Struct()
StructTypes.StructType(::Type{DbId}) = StructTypes.Struct()

Validation.validator(::Type{User}) = ModelValidator([
    ValidationRule(:username, UsersValidator.not_empty),
    ValidationRule(:username, UsersValidator.is_unique),
    ValidationRule(:password, UsersValidator.not_empty),
    ValidationRule(:email, UsersValidator.not_empty),
    ValidationRule(:email, UsersValidator.is_unique),
])

function hash_password(password::String)
    sha256(password) |> bytes2hex
end

function add(email, password; username = "", name= "")
    Genie.Assets.channels_subscribe(username)
    User(
        username=username,
        password=password |> hash_password,
        email=email,
        name = name
    ) |> SearchLight.save!
end

end