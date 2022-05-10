module CreateTableFlexpartruns

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
    create_table(:flexpartruns) do
        [
            pk()
            column(:name, :string)
            column(:path, :string)
            column(:run_date, :string)
        ]
    end

    add_index(:flexpartruns, :name)
end

function down()
    drop_table(:flexpartruns)
end

end
