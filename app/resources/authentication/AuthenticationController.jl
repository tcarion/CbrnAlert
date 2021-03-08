module AuthenticationController

using Genie, Genie.Renderer, Genie.Renderer.Html, Genie.Router
using SearchLight
using GenieAuthentication
using ViewHelper
using Users
using Logging


function pairs_array_to_dict(array)
    d = Dict()
    for pair in array
        push!(d, pair[1] => pair[2])
    end
    d
end

function show_login()
  html(:authentication, :login, context = @__MODULE__, layout=:login_layout)
end

function login()
  try
    user = SearchLight.findone(User, username = Genie.Router.@params(:username), password = Users.hash_password(Genie.Router.@params(:password)))
    GenieAuthentication.authenticate(user.id, Genie.Sessions.session(Genie.Router.@params))
    head = Genie.Requests.payload()[:REQUEST].headers |> pairs_array_to_dict
    if haskey(head, "X-Forwarded-For")
        client_ip = head["X-Forwarded-For"]
        list_ips = if user.connected_with_ips != "" split(user.connected_with_ips, ',') else String[] end
        if !(client_ip in list_ips) push!(list_ips, client_ip) end
        user.connected_with_ips = join(list_ips, ',')
    end
    user.connections_number += 1
    SearchLight.save!(user)

    Genie.Renderer.redirect(:dashboard)
  catch ex
    Genie.Flash.flash("Authentication failed")

    Genie.Renderer.redirect(:show_login)
  end
end

function logout()
  GenieAuthentication.deauthenticate(Genie.Sessions.session(Genie.Router.@params))

  Genie.Flash.flash("Good bye! ")

  Genie.Renderer.redirect(:show_login)
end

function show_register()
  Genie.Renderer.Html.html(:authentication, :register, context = @__MODULE__)
end

function register()
  try
    user = User(username  = Genie.Router.@params(:username),
                password  = Genie.Router.@params(:password) |> Users.hash_password,
                name      = Genie.Router.@params(:name),
                email     = Genie.Router.@params(:email)) |> SearchLight.save!

    GenieAuthentication.authenticate(user.id, Genie.Sessions.session(Genie.Router.@params))

    "Registration successful"
  catch ex
    @error ex

    if hasfield(typeof(ex), :msg)
      Genie.Flash.flash(ex.msg)
    else
      Genie.Flash.flash(string(ex))
    end

    Genie.Renderer.redirect(:show_register)
  end
end

end