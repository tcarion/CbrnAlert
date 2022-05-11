module CreateTableFlexpartinputs

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:flexpartinputs) do
    [
      pk()
      columns([
        :name => :string
        :path => :string
        :date_created => :string
        :status => :string
      ])
    ]
  end

  add_index(:flexpartinputs, :name)
  # add_indices(flexpartinputs, :column_name_1, :column_name_2)
end

function down()
  drop_table(:flexpartinputs)
end

end
