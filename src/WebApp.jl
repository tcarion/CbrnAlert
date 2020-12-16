module WebApp

using Logging, LoggingExtras

function main()
  Base.eval(Main, :(const UserApp = WebApp))

  include(joinpath("..", "genie.jl"))

  Base.eval(Main, :(const Genie = WebApp.Genie))
  Base.eval(Main, :(using Genie))
end; main()

end
