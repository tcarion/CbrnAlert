module AddEnsembleToFlexpartinput

import SearchLight.Migration: add_column, remove_column

function up()
    add_column(:flexpartinputs, :ensemble, :bool)
end

function down()
    remove_column(:flexpartinputs, :ensemble)
end

end
