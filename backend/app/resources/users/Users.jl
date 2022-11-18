module Users

using Genie

using SearchLight, SearchLight.Validation, CbrnAlertApp.UsersValidator
using SearchLight.Relationships
using SHA
using StructTypes
using JSONWebTokens

using CbrnAlertApp: PUK_PATH, PRK_PATH

export User, user_related

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

function current_user()
    email = getsubject()
    findone(User, email = email)
end

function getsubject()
    jwt = _decode()
    jwt["sub"]
end

function _decode()
    try
        head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
        bearer = head["Authorization"]
        token = split(bearer, "Bearer")[2] |> strip
        JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)
    catch
        throw(Genie.Exceptions.RuntimeException("Not authorized", "No authorization has been provided", 401))
    end
end

function authenticated()
    try
        _decode()
        true
    catch
        return false
    end
end

function hasaccess(model::AbstractModel)
    if !isrelated(model, current_user())
        return false
    end
    true
end

macro authenticated!(exception=Genie.Exceptions.ExceptionalResponse(Genie.Router.error(401, "Access to this API is not authorized", "application/json")))
    :(AuthenticationController.authenticated() || throw($exception))
end

macro hasaccess!(model, exception=Genie.Exceptions.ExceptionalResponse(Genie.Router.error(401, "Unauthorized", "application/json", error_info = "You don't have access to these data")))
    :(AuthenticationController.hasaccess($model) || throw($exception))
end

function user_related(model::Type{<:AbstractModel})
    related(current_user(), model)
end

pairs_array_to_dict(array) = Dict(pair[1] => pair[2] for pair in array)

end