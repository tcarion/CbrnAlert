module CbrnAlertApp

using Genie

const up = Genie.up
export up

# Import the server API generated from Open API specifications.
# Remove these lines if CbrnAlertApp is in `dev` and has been added to `Project.toml`
include(joinpath("..", "..", "api", "CbrnAlertAPI", "src", "CbrnAlertAPI.jl"))
using .CbrnAlertAPI
const API = CbrnAlertAPI

function main()
  Genie.genie(; context = @__MODULE__)
end

end
