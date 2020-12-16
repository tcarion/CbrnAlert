using PyCall

function near(lon, lat)
  pushfirst!(PyVector(pyimport("sys")."path"), "/home/tcarion/WebApp/lib")
  rg = pyimport("readgrib")

  index_keys = ["date", "time", "shortName", "level", "step"]
  reader = rg.GribReader("/home/tcarion/grib_files/tigge202009_totalgrid.grib", index_keys)
  ajax_received = Dict(
      "lat" => lat,
      "lon" => lon,
      "date" => reader.idx_get("date")[1],
      "time" => reader.idx_get("time")[1],
      "step" => reader.idx_get("step")[1],
  )

  lat = typeof(ajax_received["lat"]) == String ? parse(Float64, ajax_received["lat"]) : ajax_received["lat"]
  lon = typeof(ajax_received["lon"]) == String ? parse(Float64, ajax_received["lon"]) : ajax_received["lon"]

  keys_to_select = Dict(
    "date" => ajax_received["date"],
    "step" => ajax_received["step"],
    "time" => ajax_received["time"],
    "level"=> reader.idx_get("level")[1],
    "shortName" => reader.idx_get("shortName")[1]
  )
  reader.idx_select(keys_to_select)
  reader.new_handle()

  nearest = reader.find_nearest(lon, lat, 4)
end