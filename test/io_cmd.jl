using FileWatching
using Sockets

path = joinpath(pwd(), "hello.txt")
cd("./test")
f = open("hello.txt", "a", lock=true)

cmd1 = `echo start`
cmd2 = `echo end\nline1\nline2`
write(f, read(cmd1, String))
flush(f)
isopen(f)
close(f)

fr = open("hello.txt", "r")
readlines(fr)
isopen(fr)
close(fr)

FileWatching.watch_file(path)

readlines(cmd2)

f = open("hello.txt", "a", lock=true)
@async redirect_stdout(f) do 
    run(`./sleeping_script.sh`)
end

p = open("named_pipe")
a = @async run(`./sleeping_script.sh`)


named_pipe = "testsocket"
@async begin
    server = listen(named_pipe)
    while true
        sock = accept(server)
        # @async while isopen(sock)
        #     write(sock, readline(sock, keep=true))
        # end
        println("STARTING TO RUN SCRIPT")
        @async redirect_stdout(sock) do 
            open("ERRORS.txt", "a") do erf
                redirect_stderr(erf) do
                    run(`./sleeping_script.sh`)
                    write("\n")
                end
            end
            close(sock)
        end
        println("SCRIPT ENDED")
    end
end

clientside = connect(named_pipe)
r = readline(clientside)

while r != ""
    println(r)
    r = readline(clientside) 
end
# while !eof(clientside)
#     x = readavailable(clientside)
#     println(x)
# end
close(clientside)
rm("testsocket")
# c1 = Channel()
@async begin
    while !eof(clientside)
        open("broadcasted", "a") do
            write(c1, readline(clientside))
        end
    end
end


# @async while isopen(clientside)
#     write(stdout, readline(clientside, keep=true))
# end

# open(`./sleeping_script.sh`, "r", stdout) do io
#     open("hello.txt", "a", lock=true) do f
#         write(f, readlines(io))
#     end
# end
cmd = `./sleeping_script.sh`
cmd = `mars ../tmp/req`
p = open(cmd)
readline(p)
# open(cmd) do stream
#     readline(stream)
# end
while !eof(p)
    println(readline(p))
end
process_running(p)
success(p)
close(p)
isopen(p)
run(`./sleeping_script.sh`)

b = IOBuffer()
writer = @async write(b, "data")
reader = @async println(read(b, String))

wait(writer)
fetch(reader)