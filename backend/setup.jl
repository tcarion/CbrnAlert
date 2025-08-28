# this fix is due to a bug in flex_extract when retrieving ensemble data. When devs fix it, it can be removed.
using FlexExtract
faulty_script = joinpath(FlexExtract.PATH_FLEXEXTRACT, "Source", "Python", "Mods", "checks.py")
run(`sed -i "882s@'{:0>3}'.join(numbers)@'/'.join(numbers)@" $faulty_script`)

if isfile(joinpath("db", "db.sqlite"))
    println("db exists, skipping initialization")
    exit()
end
  
using Genie
Genie.loadapp()
  
using SearchLight
using SearchLightSQLite
SearchLight.Migration.init()
SearchLight.Migration.status()
SearchLight.Migration.allup()
  
using CbrnAlertApp
using CbrnAlertApp.Users
Users.add("test", "test", username = "test")