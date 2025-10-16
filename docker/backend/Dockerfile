FROM julia:1.10-bookworm

# Set working directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# RUN apt-get install -y \
#     python3-genshi python3-eccodes python3-numpy python3-cdsapi

# First instantiate for better caching
COPY CbrnAlert/backend/Manifest.toml CbrnAlert/backend/Project.toml /app/backend/

# Install Julia dependencies (adjust based on your Project.toml/Manifest.toml)
# The first instantiation might fail. It should be fixed with following commands
RUN julia --project -e 'using Pkg; Pkg.instantiate()'; exit 0

# Configure PyCall to use a Julia-specific Python distribution
RUN julia --project -e ' \
    ENV["PYTHON"] = ""; \
    using Pkg; \
    Pkg.build("PyCall")'; exit 0

# Copy application code
COPY CbrnAlert/backend /app/backend
COPY CbrnAlert/api /app/api

# Alternatively, clone from GitHub directly:
# RUN git clone https://github.com/tcarion/CbrnAlert.git /app

# TODO: Find a better solution for the following line
RUN sed -i 's/include(joinpath("..".*/include(joinpath(@__FILE__, "..", "..", "..", "api", "CbrnAlertAPI", "src", "CbrnAlertAPI.jl"))/g' src/CbrnAlertApp.jl

RUN julia --project -e 'using Pkg; Pkg.instantiate(); Pkg.precompile()'

# Set up the database
RUN julia --project -e ' \
    using Genie; \
    Genie.loadapp(); \
    using SearchLight; \
    using SearchLightSQLite; \
    SearchLight.Migration.init(); \
    SearchLight.Migration.status(); \
    SearchLight.Migration.allup()'

# Generate the keys for encoding and decoding the JSON Web Tokens authentication payloads.
RUN openssl genrsa -out config/private.pem 2048
RUN openssl rsa -in config/private.pem -out config/public.pem -outform PEM -pubout

RUN julia --project -e 'using Genie; Genie.loadapp(); using CbrnAlertApp.Users; Users.add("default", "password", username = "username")'

# Expose the API port
EXPOSE 8000

# Create entrypoint script
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]