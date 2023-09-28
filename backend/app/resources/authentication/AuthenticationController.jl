module AuthenticationController

using Genie, Genie.Renderer, Genie.Renderer.Html, Genie.Router
using SearchLight
using CbrnAlertApp.Users
using Logging
using JSONWebTokens

using CbrnAlertApp.Users
using CbrnAlertApp: PUK_PATH, PRK_PATH, UNAUTHORIZED

function login()
    exp = 60 * 60
    payload = Genie.Requests.jsonpayload()
    user = SearchLight.findone(User, email=payload["email"], password=Users.hash_password(payload["password"]))
    if !isnothing(user)
        cont = Dict(
            "exp" => exp,
            "sub" => user.email,
        )
        jwt = JSONWebTokens.encode(JSONWebTokens.RS256(PRK_PATH), cont)

        return Genie.Renderer.Json.json(Dict(
            "idToken" => jwt,
            "expiresIn" => exp,
            "user" => Dict(
                "email" => user.email,
                "username" => user.username,
                "name" => user.name,
            )
        ))

    else
        throw(UNAUTHORIZED)
    end
end


end