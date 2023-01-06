using Test, Main.UserApp, Main.UserApp.Atp45Controller

@testset "atp45 routes" begin
    routes = API_DOCS["paths"]

    loginpath = "/login"
    payload = Dict(
        "email" => TEST_USER.email,
        "password" => TEST_USER.password,
    )
    response = post_request_body(loginpath, payload)
    token = response[:idToken]

    routepath = "/forecast/available"
    result = get_request_body(routepath; token = token)
    schema = response_schema(routepath; method = "GET", response = "200")
    @test keys_in(schema, result)

    routepath = "/atp45/tree"
    result = get_request_body(routepath; token = token)
    @test result.id == "root"
    @test haskey(result, :children)

    routepath = "/atp45/run/wind"
    payload = post_request_body_schema(routepath)
    schema = response_schema(routepath; method = "POST", response = "200")
    result = post_request_body(routepath, payload; token)
    @test keys_in(schema, result)
end