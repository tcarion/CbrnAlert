module AuthenticationController

using Genie, Genie.Renderer, Genie.Renderer.Html, Genie.Router
using SearchLight
using ViewHelper
using Users
using Logging
using JSONWebTokens

const PRK_PATH = "config/private.pem"
const PUK_PATH = "config/public.pem"

# const PRK = JSONWebTokens.RS256(PRK_PATH)

# function pairs_array_to_dict(array)
#     d = Dict()
#     for pair in array
#         push!(d, pair[1] => pair[2])
#     end
#     d
# end

pairs_array_to_dict(array) = Dict(pair[1] => pair[2] for pair in array)

# function show_login()
#     html(:authentication, :login, context=@__MODULE__, layout=:login_layout)
# end

# function login()
#   try
#     user = SearchLight.findone(User, username = Genie.Router.@params(:username), password = Users.hash_password(Genie.Router.@params(:password)))
#     GenieAuthentication.authenticate(user.id, Genie.Sessions.session(Genie.Router.@params))
#     head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
#     if haskey(head, "X-Forwarded-For")
#         client_ip = head["X-Forwarded-For"]
#         list_ips = if user.connected_with_ips != "" split(user.connected_with_ips, ',') else String[] end
#         if !(client_ip in list_ips) push!(list_ips, client_ip) end
#         user.connected_with_ips = join(list_ips, ',')
#     end
#     user.connections_number += 1
#     SearchLight.save!(user)

#     Genie.Renderer.redirect(:dashboard)
#   catch ex
#     Genie.Flash.flash("Authentication failed")

#     Genie.Renderer.redirect(:show_login)
#   end
# end

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

      # Genie.Renderer.Json.json(cont)
      # GenieAuthentication.authenticate(user.id, Genie.Sessions.session(Genie.Router.@params))
      # head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
      # if haskey(head, "X-Forwarded-For")
      #     client_ip = head["X-Forwarded-For"]
      #     list_ips = if user.connected_with_ips != "" split(user.connected_with_ips, ',') else String[] end
      #     if !(client_ip in list_ips) push!(list_ips, client_ip) end
      #     user.connected_with_ips = join(list_ips, ',')
      # end
      # user.connections_number += 1
      # SearchLight.save!(user)
  
      # Genie.Renderer.redirect(:dashboard)
    else
      # e = Genie.Exceptions.InternalServerException("User not found", "Email or password must be incorrect", 401)
      # throw(e)
      # throw(ex)
        Genie.Router.error(401, "User not found", "application/json", error_info="Email or password must be incorrect")
      # Genie.Flash.flash("Authentication failed")
      # return json(Dict(:login =>"aaaa"))
      # Genie.Renderer.redirect(:show_login)
    end
end

function isauth()
    head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
    # @show head
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

# function logout()
#     GenieAuthentication.deauthenticate(Genie.Sessions.session(Genie.Router.@params))

#     Genie.Flash.flash("Good bye! ")

#     Genie.Renderer.redirect(:show_login)
# end

# function show_register()
#     Genie.Renderer.Html.html(:authentication, :register, context=@__MODULE__)
# end

# function register()
#     try
#         user = User(username=Genie.Router.@params(:username),
#                 password=Genie.Router.@params(:password)   |> Users.hash_password,
#                 name=Genie.Router.@params(:name),
#                 email=Genie.Router.@params(:email)) |> SearchLight.save!

#         GenieAuthentication.authenticate(user.id, Genie.Sessions.session(Genie.Router.@params))

#         "Registration successful"
#     catch ex
#         @error ex

#         if hasfield(typeof(ex), :msg)
#             Genie.Flash.flash(ex.msg)
#         else
#             Genie.Flash.flash(string(ex))
#         end

#         Genie.Renderer.redirect(:show_register)
#     end
# end

end