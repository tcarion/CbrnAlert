module FlexpartRunsController

import Base: @kwdef
using SearchLight.Relationships
using Dates
using UUIDs
using Flexpart
using Flexpart.FlexpartOptions: OptionType
using JSON3
using StructTypes

using CbrnAlertApp.FlexpartRuns

import CbrnAlertApp.Users
using CbrnAlertApp.SharedModels

function create()
  uuid = string(UUIDs.uuid4())
  path = joinpath(FLEXPART_RUNS_DIR, uuid)
  fpdir = Flexpart.create(path)
  fpdir = FlexpartDir(path)
  fpoptions = FlexpartOption(fpdir)
  newentry = FlexpartRun(
      uuid = uuid,
      name = uuid,
      path = relpath(path),
      options = JSON3.write(fpoptions.options)
      # date_created = Dates.format(Dates.now(), DATE_FORMAT)
  )
  newentry |> save!
end

isfinished(entry) = entry.status == FINISHED

function change_status(name::String, value::String)
  entry = findone(FlexpartRun, name = name)
  entry.status = value
  entry |> save!
end

function change_options(name::String, fpoptions::FlexpartOption)
  entry = findone(FlexpartRun, name = name)
  entry.options = JSON3.write(fpoptions.options)
  # entry.options = fpoptions.options
  # entry.options = ""
  entry |> save!
end

function get_options(entry::FlexpartRun)
  JSON3.read(entry.options)
end

function assign_to_user!(user::Users.User, fpres::FlexpartRun)
  Relationship!(user, fpres)
end

function delete_non_existing()
  entries = all(FlexpartRun)
  for entry in entries
      if !isdir(entry.path)
          delete(entry)
      end
  end
end

function delete(entry)
  isdir(entry.path) && rm(entry.path, recursive=true)
  SearchLight.delete(entry)
end

end
