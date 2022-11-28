using HTTP
using JSON3

function get_request(route)
    response = try
        HTTP.request("GET", _fullroute(route))
    catch ex
        ex.response
    end

    JSON3.read(String(response.body))
end

function post_request(route, payload)
    response = try
        HTTP.request("POST", _fullroute(route),
                  [("Content-Type", "application/json; charset=utf-8")], JSON3.write(payload))
    catch ex
        ex.response
    end

    JSON3.read(String(response.body))
end

# HTTP.open("POST", _fullroute(route), [("Content-Type", "application/json; charset=utf-8")]) do http
#     write(http, JSON3.write(payload))
#     println(Genie.Requests.jsonpayload())
# end

function _fullroute(route)
    "http://"*ROOT_URL*"/api"*route
end
