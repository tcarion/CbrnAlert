module AddEnsembleToFlexpartrun

import SearchLight.Migration: add_column, remove_column

function up()
    add_column(:flexpartruns, :ensemble, :bool)
end

function down()
    remove_column(:flexpartruns, :ensemble)
end

end
