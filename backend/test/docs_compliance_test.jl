using Test, Main.UserApp, Main.UserApp.Users
using Genie
using SearchLight
using JSON3

@testset "Request and response for routes agree with docs" begin
    api_routes = filter(x -> (occursin("api/", x.path) && !occursin("login", x.path)), Genie.routes())

    loginpath = "/login"
    payload = Dict(
        "email" => TEST_USER.email,
        "password" => TEST_USER.password,
    )
    response = post_request_body(loginpath, payload)
    token = response[:idToken]
    auth = "Bearer $token"

    for testroute in api_routes
        method = testroute.method
        routepath = testroute.path
        println("testing method $(method) on path $(routepath)")
        
        response = try
            if String(method) == "GET"
                HTTP.request(method, _fullroute(routepath; prec = ""),  [
                    ("Content-Type", "application/json; charset=utf-8"), 
                    ("Authorization", "Bearer $token")
                    ])
            else
                payload = post_request_body_schema(routepath)
                HTTP.request(method, _fullroute(routepath; prec = ""), JSON3.write(payload), [
                    # ("Content-Type", "application/json; charset=utf-8"), 
                    ("Authorization", "Bearer $token")
                    ])
            end
        catch e
            e.response
        end
        
        result = JSON3.read(String(response.body))
        expected_schema = response_schema(replace(routepath, "/api" => ""); method = method, response = "200")
        @test keys_in(expected_schema, result) 
    end
end
