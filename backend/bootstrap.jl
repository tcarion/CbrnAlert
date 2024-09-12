(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

# using Pkg

# # Update all packages
# Pkg.update()

# # Resolve any dependency conflicts
# Pkg.resolve()

# # Rebuild packages if necessary
# Pkg.build()

# # Ensure the environment is instantiated
# Pkg.instantiate()

using CbrnAlertApp
const UserApp = CbrnAlertApp
CbrnAlertApp.main()