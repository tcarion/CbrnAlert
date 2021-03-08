module ViewHelper

using Genie, Genie.Flash, Genie.Router

export output_flash, user_info

function output_flash() :: String
  flash_has_message() ? """<div class="form-group alert alert-info">$(flash())</div>""" : ""
end

function user_info()
    flash_has_message() ? """ 
    <div>User name :</div>
    <div>$(flash()[:username])</div>
    <div>User email :</div>
    <div>$(flash()[:user_email])</div> """ : ""
end

end