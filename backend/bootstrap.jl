(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using CbrnAlertApp
push!(Base.modules_warned_for, Base.PkgId(CbrnAlertApp))
CbrnAlertApp.main()
