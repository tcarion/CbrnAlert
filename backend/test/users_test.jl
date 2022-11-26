using Test, Main.UserApp, Main.UserApp.Users
using Genie
using SearchLight

@testset "Set up Users table" begin
    SearchLight.Migrations.up("CreateTableUsers")
end

@testset "Users unit tests" begin
    deleteall(User)
    email = "test@test.com"
    Users.add(email, "pw"; username = "username", name = "name")
    user = findone(User, email = email)
    @test user.email == email
    user.username = "foo"
    save(user)
    @test length(all(User)) == 1
    @test first(find(User)).username == "foo"

    @test_throws Genie.Exceptions.RuntimeException Users.current_user()
    @test_throws Genie.Exceptions.RuntimeException Users.user_related(User)
end;
  