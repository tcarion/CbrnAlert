using HTTP
using JSON3

# A lot of repetitive code, should be written more concisely in the future
function get_request_body(route; prec="/api", token="")
    auth = token == "" ? "" : "Bearer $token"
    response = try
        HTTP.request("GET", _fullroute(route; prec),
            [("Authorization", auth)]
        )
    catch ex
        ex.response
    end

    JSON3.read(String(response.body))
end

function get_request_raw(route; prec="/api", token="")
    auth = token == "" ? "" : "Bearer $token"
    response = try
        HTTP.request("GET", _fullroute(route; prec),
            [("Authorization", auth)]
        )
    catch ex
        ex
    end

    response
end


function post_request_body(route, payload; prec="/api", token="")
    auth = token == "" ? "" : "Bearer $token"
    response = try
        HTTP.request("POST", _fullroute(route; prec),
            [("Content-Type", "application/json; charset=utf-8"), ("Authorization", auth)], JSON3.write(payload))
    catch ex
        ex.response
    end

    JSON3.read(String(response.body))
end

function post_request_raw(route, payload; prec="/api")
    response = try
        HTTP.request("POST", _fullroute(route; prec),
            [("Content-Type", "application/json; charset=utf-8")], JSON3.write(payload))
    catch ex
        ex
    end

    response
end

# HTTP.open("POST", _fullroute(route), [("Content-Type", "application/json; charset=utf-8")]) do http
#     write(http, JSON3.write(payload))
#     println(Genie.Requests.jsonpayload())
# end

function _fullroute(route; prec="/api")
    "http://" * ROOT_URL * prec * route
end
