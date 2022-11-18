module AuthenticationController

using Genie, Genie.Renderer, Genie.Renderer.Html, Genie.Router
using SearchLight
using CbrnAlertApp.Users
using Logging
using JSONWebTokens

using CbrnAlertApp.Users
using CbrnAlertApp: PUK_PATH, PRK_PATH

function login()
    exp = 60 * 60
    payload = Genie.Requests.jsonpayload()
    user = SearchLight.findone(User, email=payload["email"], password=Users.hash_password(payload["password"]))
    if !isnothing(user)
        # @show payload
        # @show Genie.Router.@params()
        cont = Dict(
            "exp" => exp,
            "sub" => user.email,
        )
        jwt = JSONWebTokens.encode(JSONWebTokens.RS256(PRK_PATH), cont)

        Genie.Renderer.Json.json(Dict(
            "idToken" => jwt,
            "expiresIn" => exp,
            "user" => Dict(
                # "id" => user.id,
                "email" => user.email,
                "username" => user.username,
                "name" => user.name,
            )
        ))

    else
        Genie.Router.error(401, "User not found", "application/json", error_info="Email or password must be incorrect")
    end
end

# function isauth()
#     head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
#     if !haskey(head, "Authorization")
#         return Genie.Router.error(401, "No Authorization", "application/json")
#     end

#     bearer = head["Authorization"]

#     try
#         token = split(bearer, "Bearer")[2] |> strip
#         jwt = JSONWebTokens.decode(JSONWebTokens.RS256(PUK_PATH), token)
#         nothing
#     catch
#         return Genie.Router.error(401, "Not authorized", "application/json")
#     end
# end

end