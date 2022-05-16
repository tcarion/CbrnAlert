module Upateflexpartinputs
using SearchLight.Migration: remove_columns, add_columns

function up()
    remove_columns(:flexpartinputs, [:date_created])
    add_columns(:flexpartinputs, [:date_created => :date])
end

function down()

end

end
