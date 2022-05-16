module CreateTableFlexpartruns

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
    create_table(:flexpartruns) do
        [
            pk()
            column(:name, :string)
            column(:path, :string)
            column(:date_created, :date)
            column(:status, :string)
            column(:options, :string)
        ]
    end

    add_index(:flexpartruns, :name)
end

function down()
    drop_table(:flexpartruns)
end

end
