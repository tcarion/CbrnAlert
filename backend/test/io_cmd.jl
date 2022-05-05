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

script = """
#!/bin/sh
echo 1
sleep 1
echo 2 >&2
sleep 1
echo 3
sleep 1
echo 4
       """

cmdscr = `sh -c $script`
oc = OutputCollector(`sh -c $script`; verbose = true);

out = Pipe()

run(pipeline(cmdscr, stdin=devnull, stdout=out, stderr=out))

c1 = Channel()
c2 = Channel()


task = @async while true
    data = take!(c1)
    write(logf, data)
    put!(c2, data)
end

put!(c2, "TESDQS")
take!(c2)

logf = open("log.log", "w")
p1 = Pipe()
run(pipeline(cmd, stderr=p1))
flush(logf)
close(logf)
task = @async while true
    data = readline(p1, keep=true)
    Base.write(logf, data)
    flush(logf)
    # put!(c2, data)
end

task = @async while true
    data = readline(p1, keep=true)
    Base.write(logf, data)
    flush(logf)
    # put!(c2, data)
end

open(pipeline(cmdscr, stderr=stdout)) do proc
    while !eof(proc)
        # f(process)
        line = readline(proc, keep=true)
        Base.write(logf, line)
        flush(logf)
    end
end

function execute(cmd::Base.Cmd)
    out = IOBuffer()
    err = IOBuffer()
    process = run(pipeline(ignorestatus(cmd), stdout=out, stderr=err))
    return (stdout = String(take!(out)),
            stderr = String(take!(err)),
            code = process.exitcode)
end

proc = execute(pipeline(cmd, stderr=stdout))