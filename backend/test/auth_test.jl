using Test, Main.UserApp, Main.UserApp.Users
using Genie
using SearchLight

@testset "All api routes are secured" begin
    api_routes = filter(x -> (occursin("api/", x.path) && !occursin("login", x.path)), Genie.routes())

    for testroute in api_routes
        println("testing method $(testroute.method) on path $(testroute.path)")
        result = try
            HTTP.request(testroute.method, _fullroute(testroute.path; prec = ""), Dict())
        catch e
            e.response
        end
        @test result.status == 401
    end
end

@testset "Add and authorize user" begin
    deleteall(User)
    Users.add(TEST_USER.email, TEST_USER.password; username = TEST_USER.username)

    testroute = "/login"
    payload = Dict(
        "email" => TEST_USER.email,
        "password" => TEST_USER.password,
    )
    schema = post_response_schema(testroute; response = "200")
    response = post_request_body(testroute, payload)
    @test response[:user][:username] == TEST_USER.username
    @test keys_in(schema, response)

    token = response[:idToken]
    decoded = Users.decode(token)
    @test decoded["sub"] == TEST_USER.email

    payload_wrong = Dict(
        "email" => "email",
        "password" => "pw",
    )
    response = post_request_raw(testroute, payload_wrong)
    @test response.status == 401
    response = post_request_body(testroute, payload_wrong)
    schema = post_response_schema(testroute; response = "401")
    @test keys_in(schema, response)


    # @test response["error"] == "401 Error - Not authorized"

end;
  