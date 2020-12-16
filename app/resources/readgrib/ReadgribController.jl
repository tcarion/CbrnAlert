module ReadgribController

using PyCall
using Genie.Renderer.Html
function initiateform()
  pushfirst!(PyVector(pyimport("sys")."path"), "/home/tcarion/WebApp/lib")
  rg = pyimport("readgrib")
  pyimport("importlib")."reload"(rg) #### TO BE REMOVED IN PRODUCTION
  keys_to_select = ["date", "time", "shortName", "level", "step"]
  reader = rg.GribReader("/home/tcarion/grib_files/20171201_to_20171231_tigge.grib", keys_to_select)
  dates = reader.idx_get("date")
  times = reader.idx_get("time")
  steps = reader.idx_get("step")
  
  html(:readgrib, "initiateform.jl.html", dates = dates, times=times, steps=steps, layout=:app)

end

end
