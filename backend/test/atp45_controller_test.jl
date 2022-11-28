using Test, Main.UserApp, Main.UserApp.Atp45Controller

@testset "atp45 routes" begin
    routes = API_DOCS["paths"]

    testroute = "/forecast/available"
    result = get_request(testroute)
    follows_spec(testroute, result)

    testroute = "/atp45/containers"
    result = get_request(testroute)
    follows_spec(testroute, result)
    
    testroute = "/atp45/procedures" 
    result = get_request(testroute)
    follows_spec(testroute, result)

    testroute = "/atp45/incidents"
    result = get_request(testroute)
    follows_spec(testroute, result)

    testroute = "/atp45/run/wind"
    payload = post_request_schema(testroute)
    result = post_request(testroute, payload)
    follows_spec(testroute, result; method = :POST)
    
end