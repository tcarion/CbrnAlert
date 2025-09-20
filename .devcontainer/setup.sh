#!/bin/bash

cd /app/frontend
npm install @angular/cli --force
npm install --force
npm run generate:all

cd /app/backend
openssl genrsa -out config/private.pem 2048
openssl rsa -in config/private.pem -out config/public.pem -outform PEM -pubout
yum install -y dos2unix
dos2unix ./bin/repl
export PYTHON=""
julia +1.10 --project -e 'using Pkg; Pkg.instantiate()'
julia +1.10 --project /app/backend/setup.jl

/root/.julia/conda/3/x86_64/bin/conda install --no-deps -y libgfortran4
/root/.julia/conda/3/x86_64/bin/conda install -y genshi
/root/.julia/conda/3/x86_64/bin/conda install -y eccodes
/root/.julia/conda/3/x86_64/bin/conda install -y python-eccodes
/root/.julia/conda/3/x86_64/bin/conda install -y ecmwf-api-client
/root/.julia/conda/3/x86_64/bin/conda install -y cdsapi
/root/.julia/conda/3/x86_64/bin/conda install -y numpy
/root/.julia/conda/3/x86_64/bin/conda install -y fftw