using Genie

const ROOT_URL = Genie.config.server_host*":"*string(Genie.config.server_port)

function server_setup()
    Genie.up()
end