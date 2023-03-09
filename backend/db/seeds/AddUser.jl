using CbrnAlertApp.Users
using SearchLight

function add_user(email, password, username)
    user = User(
        email  = email,
        username = username,
        password  = password |> Users.hash_password,
    ) |> SearchLight.save!
end