
using Test, SearchLight, Main.UserApp
using SearchLight: config
using SearchLight.Migration

@testset "Set up migrations table" begin
    db_path = SearchLight.config.db_config_settings["database"]
    isfile(db_path) && rm(db_path)
    config.db_migrations_folder = joinpath("..", SearchLight.MIGRATIONS_PATH)
    
    SearchLight.connect()
    Migration.init()
    Migration.status()
    Migration.all_up!!()
end
