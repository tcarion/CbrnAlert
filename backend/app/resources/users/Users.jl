module Users

using Genie

using SearchLight, SearchLight.Validation, CbrnAlertApp.UsersValidator
using SearchLight.Relationships
using SHA
using StructTypes
using JSONWebTokens
using HTTP

using CbrnAlertApp: PUK_PATH, PRK_PATH, UNAUTHORIZED, FORBIDDEN

export User, user_related

const TOKEN_KEY = :token

function __init__() :: Nothing
    Users.add_auth_header in Genie.Router.pre_match_hooks || pushfirst!(Genie.Router.pre_match_hooks, Users.add_auth_header)
  
    nothing
end

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
    # Genie.Assets.channels_subscribe(username)
    User(
        username=username,
        password=password |> hash_password,
        email=email,
        name = name
    ) |> SearchLight.save!
end

current_user(email::AbstractString) = findone(User, email = email)
function current_user(http_request::HTTP.Messages.Request)
    email = getsubject(http_request)
    findone(User, email = email)
end
function current_user()
    email = getsubject()
    current_user(email) 
end

function getsubject()
    jwt = _decode()
    jwt["sub"]
end

function getsubject(http_request)
    jwt = _decode(http_request)
    jwt["sub"]
end

function _decode()
    request = Genie.Router.request()
    _decode(request)
end

function _decode(http_request)
    try
        headers = Dict(http_request.headers)
        bearer = headers["Authorization"]
        token = split(bearer, "Bearer")[2] |> strip
        decode(token)
    catch
        throw(UNAUTHORIZED)
    end
end

decode(token) = JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)

# function _decode()
#     try
#         head = Dict(Genie.Requests.payload()[:REQUEST].headers)
#         bearer = head["Authorization"]
#         token = split(bearer, "Bearer")[2] |> strip
#         JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)
#     catch
#         throw(UNAUTHORIZED)
#     end
# end

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

macro authenticated!(exception=UNAUTHORIZED)
    :(authenticated() || throw($exception))
end

macro hasaccess!(model, exception=FORBIDDEN)
    :(hasaccess($model) || throw($exception))
end

user_related(model::Type{<:AbstractModel}) = related(current_user(), model)
user_related(model::Type{<:AbstractModel}, http_request::HTTP.Messages.Request) = related(current_user(http_request), model)


function add_auth_header(req, res, params)
    @warn "IN ADD AUTH"
    headers = Dict(req.headers)
    if haskey(headers, "Authorization")
        auth = headers["Authorization"]
        if startswith(auth, "Bearer ")
            try
                token = split(auth, "Bearer")[2] |> strip
                params[TOKEN_KEY] = token
            catch _
            end
        end
    end

    req, res, params
end

end