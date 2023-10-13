# CbrnAlert
Web application sources for CBRN dispersion modeling


# Installation
This section explains how to make the app ready both for development purpose and for production. The installation is meant to be done on Rocky Linux v9 or Centos 7, but it should be easy to adapt on other Linux systems. The main softwares needed for the application is [Julia](https://julialang.org/), [nodejs](https://nodejs.org/fr), [Angular](https://angular.io/), java and [eccodes](https://confluence.ecmwf.int/display/ECC).

## Common steps for both development and production

### Credentials for the ECMWF API
The application needs to retrieve weather forecasts from ECMWF. That means you'll need to have access to licensed datasets from ECMWF. To setup your credentials, you need to go on https://api.ecmwf.int/v1/key to get your API key, and write those lines on a file called `.ecmwfapirc` in your `$HOME` folder:

```
{
    "url"   : "https://api.ecmwf.int/v1",
    "key"   : "YOUR_API_KEY",
    "email" : "YOUR_EMAIL"
}
```

### Install Julia
Due to an issue with Flexpart.jl (see [this](https://github.com/tcarion/Flexpart.jl/issues/9)), the application will only work with Julia v1.7. To easily install Julia v1.7, you can use [Juliaup](https://github.com/JuliaLang/juliaup):

```bash
curl -fsSL https://install.julialang.org | sh
```

Accept the basic configuration, restart your shell session, and install the Julia v1.7 binary with:

```bash
juliaup add 1.7
```

Now you should be able to run this julia version with:

```bash
julia +1.7
```

### Install nodejs
The app needs at least nodejs v16.

**On Rocky Linux v9**

The registry version of nodejs is should be at least v16, so it can be installed globally:

```bash
sudo yum update nodejs
```

**On CentOS 7**

On CentOS 7, nodejs is limited to v14, so we'll need to install it locally with [nvm](https://github.com/nvm-sh/nvm):


1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
1. Uncomment NVM related lines in `~/.bashrc`
1. `chmod +x ~/.nvm/nvm.sh`
1. `source ~/.bashrc`
1. `nvm install 16` (v18 won't work because of glibc incompatibilities)

### Install Java
At the moment, Java is needed for the `openapi-generator-cli` to work properly:

```bash
sudo yum install java-11-openjdk-devel
```

### Install eccodes globally.
Unfortunately, the python program for flex_extract is executing the `grib_set` command with `subprocess.check_call()`. I couldn't find a way to make this command available in the PATH when running the python script. So `eccodes` and the `grib_*` commands must be available in the path.

```bash
sudo yum install eccodes
```

### Clone the repo

```bash
git clone https://github.com/tcarion/CbrnAlert
```

### Set up the frontend
Install the Angular command line interface:

```bash
npm install @angular/cli
```

Download and install the required javascript librairies for the frontend:
```
cd CbrnAlert/frontend
npm install
```

### Set up the backend

Go to the backend folder and open a Julia REPL:
```
cd CbrnAlert/backend
julia +1.7 --project
```

Download the required Julia packages. You will have to enter the [Pkg REPL](https://docs.julialang.org/en/v1/stdlib/Pkg/#Pkg) by pressing `]` from the Julia REPL. Then, it's needed to install `Flexpart.jl`, `ATP45.jl` and `FlexExtract.jl` which are not on the Julia official registry:
```julia
# In the Julia package mode:
(@v1.7) pkg> add https://github.com/tcarion/Flexpart.jl https://github.com/tcarion/ATP45.jl https://github.com/tcarion/FlexExtract.jl
(@v1.7) pkg> build FlexExtract
```

Finally, the following command will install all the required registered Julia packages:

```julia
(@v1.7) pkg> instantiate
```

### Set up the JSON Web Tokens keys
We need now to generate the keys for encoding and decoding the JSON Web Tokens authentication. Go to the backend folder and write:

```bash
openssl genrsa -out config/private.pem 2048
openssl rsa -in config/private.pem -out config/public.pem -outform PEM -pubout
```

*Note: These lines won't work with OpenSSL v1*
## Setup for development

To get the app up and ready for development, you'll need to follow those few steps.

### Run the backend server
Go to the backend folder, and run the `repl` scripts:

```bash
cd CbrnAlert/backend
./bin/repl
```

This will open a Julia REPL and setup the Genie environment. This may take a few minutes. Once it's done and you can write in the Julia REPL, you need to set up the database with:

```julia
using SearchLight
using SearchLightSQLite
SearchLight.Migration.init()
SearchLight.Migration.status()
SearchLight.Migration.allup()
```

And finally start the server:
```julia
julia> up()
┌ Info: 2023-10-06 09:42:54 
└ Web Server starting at http://127.0.0.1:8000 
[ Info: 2023-10-06 09:42:54 Listening on: 127.0.0.1:8000, thread id: 1
Genie.Server.ServersCollection(Task (runnable) @0x00007f821a6e42f0, nothing)
```

You should see those lines, meaning that a server is listening on `localhost:8000`.

If you want, you can also set up a `screen` session like this (probably you will have to install `screen` with `sudo yum install screen`):

```bash
screen -S cbrnalert_backend
```
 
and then follow the above steps.

If you need to start the server again, you just need to run `repl` script and run `up()` in the Julia REPL:

```bash
./bin/repl
julia> up()
```

In case you're using `screen` you can attach to your screen session with:

```bash
screen -R cbrnalert_backend
```

### Run the frontend server
Go to the frontend folder and run this command:

```bash
cd CbrnAlert/frontend
npm run generate:all
```

This will read the [OpenAPI specifications file](https://github.com/tcarion/CbrnAlert/blob/master/api/api_docs.yaml) to generate all the files needed for both the frontend and the backend.

Finally, run the frontend server that will listen to `localhost:4200`:

```bash
npm run start
```

At this point you should be able to connect to `localhost:4200` and start using the application. If you set everything up on a remote machine, you might need to use `ssh` tunnels to redirect the application ports. When using the VS code editor, this is done automatically.

## Setup for development
[TBD]