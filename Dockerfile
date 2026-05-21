# Stage 1: Compile the binary in a containered Golang environment
# 
FROM golang:1.25.0 as build

# Copy source files from the host.
# The build context excludes frontend sources via .dockerignore (e.g. ui/).
COPY . /src

# Set the working directory to the same place we copied the code
WORKDIR /src

# Build the binary!
RUN mkdir -p logs && chmod 775 logs
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -mod=vendor -ldflags="-s -w" -o=logs-viewer_amd64 .

# Stage 2: Build the Logs-Viewer image proper
#
# Use a "scratch" image, which contains no distribution files
FROM scratch

# Copy the binary from the build container
COPY --from=build src/logs-viewer_amd64 .

COPY --from=build src/logs .

# Tell Docker we'll be using port 9081
EXPOSE 9081

# Tell Docker to execute this command on a "docker run"
CMD ["/logs-viewer_amd64"]
