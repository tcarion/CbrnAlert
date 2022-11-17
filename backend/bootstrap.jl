(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using CbrnAlertApp
const UserApp = CbrnAlertApp
CbrnAlertApp.main()