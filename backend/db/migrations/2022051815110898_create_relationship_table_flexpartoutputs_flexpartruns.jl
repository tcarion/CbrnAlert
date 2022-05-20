module CreateRelationshipTableFlexpartoutputsFlexpartruns

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table

function up()
  create_table(:flexpartoutputsflexpartruns) do
    [
      pk()
      column(:flexpartoutputs_id, :int)
      column(:flexpartruns_id, :int)
    ]
  end

  add_index(:flexpartoutputsflexpartruns, :flexpartoutputs_id)
  add_index(:flexpartoutputsflexpartruns, :flexpartruns_id)
end

function down()
  drop_table(:flexpartoutputsflexpartruns)
end

end
