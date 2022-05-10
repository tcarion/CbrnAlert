module CreateTableUsers

import SearchLight.Migrations: create_table, column, primary_key, add_index, drop_table

function up()
  create_table(:users) do
    [
      primary_key()
      column(:username, :string, limit = 100)
      column(:password, :string, limit = 100)
      column(:name, :string, limit = 100)
      column(:email, :string, limit = 100)
      column(:connections_number, :int)
      column(:connected_with_ips, :string)
    ]
  end

  add_index(:users, :username)
  add_index(:users, :email)
end

function down()
  drop_table(:users)
end

end