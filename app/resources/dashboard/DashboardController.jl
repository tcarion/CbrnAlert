module DashboardController
using Genie, Genie.Renderer.Html
using Genie.Renderer
using GenieAuthentication
using ViewHelper
using SearchLight
using Users
import Genie.Exceptions.ExceptionalResponse

before() =  authenticated() || throw(ExceptionalResponse(redirect(:show_login)))

function flash_user_info()
    session = Genie.Sessions.session(Genie.Router.@params)
    uid = session.data[:__auth_user_id]
    user = SearchLight.findone(Users.User, id=uid)
    Genie.Flash.flash(Dict(:username => user.name, :user_email => user.email))
end

function dashboard()
    flash_user_info()
    html(:dashboard, "dashboard.jl.html", context = @__MODULE__, layout=:app)
end
end
