
using SearchLight
using SearchLight: config
using SearchLight.Migration

function db_setup()
    db_remove()
    config.db_migrations_folder = joinpath("..", SearchLight.MIGRATIONS_PATH)
    
    SearchLight.connect()
    Migration.init()
    # Migration.status()
    Migration.all_up!!()
end

function db_remove()
    db_path = SearchLight.config.db_config_settings["database"]
    isfile(db_path) && rm(db_path)
end