module CreateTableFlexpartoutputs

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:flexpartoutputs) do
    [
      pk()
      columns([
        :uuid => :string
        :name => :string
        :path => :string
        :date_created => :date
        :filetype => :string
        :isnested => :boolean
        :metadata => :string
      ])
    ]
  end

  add_index(:flexpartoutputs, :path)
  add_index(:flexpartoutputs, :uuid)
end

function down()
  drop_table(:flexpartoutputs)
end

end
