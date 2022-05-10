module UsersFlexpartruns

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table

function up()
  create_table(:flexpartrunsusers) do
    [
      pk()
      column(:users_id, :int)
      column(:flexpartruns_id, :int)
    ]
  end

  add_index(:flexpartrunsusers, :users_id)
  add_index(:flexpartrunsusers, :flexpartruns_id)
end

function down()
  drop_table(:flexpartrunsusers)
end

end
