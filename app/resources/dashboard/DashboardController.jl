module DashboardController
using Genie, Genie.Renderer
using GenieAuthentication
import Genie.Exceptions.ExceptionalResponse

before() =  authenticated() || throw(ExceptionalResponse(redirect(:show_login)))

function dashboard()
    Genie.Renderer.Html.html(:dashboard, "dashboard.jl.html", layout=:app)
end
end
