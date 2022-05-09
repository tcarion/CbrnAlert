module AuthenticationController

using Genie, Genie.Renderer, Genie.Renderer.Html, Genie.Router
using SearchLight
using Users
using Logging
using JSONWebTokens

const PRK_PATH = "config/private.pem"
const PUK_PATH = "config/public.pem"

pairs_array_to_dict(array) = Dict(pair[1] => pair[2] for pair in array)

typedict(x) = Dict(string(fn) => getfield(x, fn) for fn ∈ fieldnames(typeof(x)))

function login()
    exp = 60 * 60
    payload = Genie.Requests.jsonpayload()
    user = SearchLight.findone(User, email=payload["email"], password=Users.hash_password(payload["password"]))
    if !isnothing(user)
        @show payload
        # @show Genie.Router.@params()
        cont = Dict(
            "exp" => exp,
            "sub" => user.id,
        )
        jwt = JSONWebTokens.encode(JSONWebTokens.RS256(PRK_PATH), cont)

        Genie.Renderer.Json.json(Dict(
            "idToken" => jwt,
            "expiresIn" => exp,
            "user" => Dict(
                "id" => user.id,
                "email" => user.email,
                "username" => user.username,
            )
        ))

    else
        Genie.Router.error(401, "User not found", "application/json", error_info="Email or password must be incorrect")
    end
end

function isauth()
    head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
    if !haskey(head, "Authorization")
        return Genie.Router.error(401, "No Authorization", "application/json")
    end

    bearer = head["Authorization"]

    try
        token = split(bearer, "Bearer")[2] |> strip
        jwt = JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)
        nothing
    catch
        return Genie.Router.error(401, "Not authorized", "application/json")
    end
end

function authenticated()
    head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
    if !haskey(head, "Authorization")
        return false
    end

    bearer = head["Authorization"]

    try
        token = split(bearer, "Bearer")[2] |> strip
        JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)
        true
    catch
        return false
    end
end


macro authenticated!(exception=Genie.Exceptions.ExceptionalResponse(Genie.Router.error(401, "Access to this API is not authorized", "application/json")))
    :(AuthenticationController.authenticated() || throw($exception))
end

end