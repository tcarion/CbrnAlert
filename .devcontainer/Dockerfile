FROM rockylinux:9

RUN sh -c 'curl -fsSL https://install.julialang.org | sh -s -- -y --default-channel 1.7'
RUN dnf install -y 'dnf-command(config-manager)'
RUN dnf config-manager --set-enabled crb
RUN dnf install -y epel-release
RUN dnf install -y git nodejs java-11-openjdk-devel eccodes
