using Users
using SearchLight

function add_user(username, password)
    user = User(username  = username,
                password  = password |> Users.hash_password,
                ) |> SearchLight.save!
end