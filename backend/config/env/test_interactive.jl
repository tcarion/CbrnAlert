using Genie, Logging, SearchLight

Genie.Configuration.config!(
  server_port                     = 8001,
  server_host                     = "127.0.0.1",
  log_level                       = Logging.Debug,
  log_to_file                     = true,
  server_handle_static_files      = true,
#   db_migrations_folder            = joinpath("..", SearchLight.MIGRATIONS_PATH)
)

ENV["JULIA_REVISE"] = "on"