module AddMemberToFlexpartoutput

import SearchLight.Migration: add_column, remove_column

function up()
  add_column(:flexpartoutputs, :member, :string)
end

function down()
  remove_column(:flexpartoutputs, :member)
end

end
