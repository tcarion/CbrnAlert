FROM rockylinux:9

### Downloads & Installs required programs and modules
RUN sh -c 'curl -fsSL https://install.julialang.org | sh -s -- -y --default-channel 1.10' && \
    dnf update -y && \
    dnf install -y 'dnf-command(config-manager)' && \
    dnf config-manager --set-enabled crb && \
    dnf install -y epel-release
RUN dnf install -y git nodejs java-11-openjdk-devel eccodes g++ cmake python3-genshi autoconf wget flex bison vim libtool numpy netcdf
RUN dnf install -y eccodes-devel netcdf-fortran netcdf-fortran-openmpi netcdf-fortran-devel