module CreateTableFlexpartinputs

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:flexpartinputs) do
    [
      pk()
      columns([
        :uuid => :string
        :name => :string
        :path => :string
        :date_created => :date
        :status => :string
        :control => :string
      ])
    ]
  end

  add_index(:flexpartinputs, :uuid)
  add_index(:flexpartinputs, :path)
  # add_indices(flexpartinputs, :column_name_1, :column_name_2)
end

function down()
  drop_table(:flexpartinputs)
end

end
