#!/bin/bash

cd frontend
npm install @angular/cli
npm install
npm run generate:all

cd ../backend
export PYTHON=""
julia --project -e 'using Pkg; Pkg.instantiate()'
julia --project setup.jl
