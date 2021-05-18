HTTP.WebSockets.listen("127.0.0.1", UInt16(8081)) do ws
    while !eof(ws)
        data = readavailable(ws)
        data = String(data)
        if data["channel"] == "1"
            write(ws, data["message"])
        end
    end
end

HTTP.WebSockets.open("ws://127.0.0.1:8081") do ws
    write(ws, "dqsdqsd")
end