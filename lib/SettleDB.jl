using SearchLight
using Users

SearchLight.Migrations.create_migrations_table()

SearchLight.query("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'")

SearchLight.Migrations.status()

SearchLight.Migrations.last_up()

Users.add_user("username", "password", "usermail@mail.be")