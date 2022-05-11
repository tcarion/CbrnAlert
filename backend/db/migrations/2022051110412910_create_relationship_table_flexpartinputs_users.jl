module CreateRelationshipTableFlexpartinputsUsers

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table

function up()
  create_table(:flexpartinputsusers) do
    [
      pk()
      column(:users_id, :int)
      column(:flexpartinputs_id, :int)
    ]
  end

  add_index(:flexpartinputsusers, :flexpartinputs_id)
  add_index(:flexpartinputsusers, :users_id)
end

function down()
  drop_table(:flexpartinputsusers)
end

end
