module AddErrorToFlexpartinput

import SearchLight.Migration: add_column, remove_column

function up()
    add_column(:flexpartinputs, :error_message, :string)
end

function down()
    remove_column(:flexpartinputs, :error_message)
end

end
