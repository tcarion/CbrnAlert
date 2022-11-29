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

    @test_throws SearchLight.Exceptions.InvalidModelException Users.add(email, "pw2"; username = "username2", name = "name2")

    Users.add("email", "pw2"; username = "username2", name = "name2")

    @test all(User)[2].email == "email"

    @test_throws Genie.Exceptions.ExceptionalResponse Users.current_user()
    @test_throws Genie.Exceptions.ExceptionalResponse Users.user_related(User)
    deleteall(User)
end;
  