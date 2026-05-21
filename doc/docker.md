# Docker

## Usage

```bash
# build docker image
make build/docker

# run docker container
make run/docker
```

### Build

The build is divided into two stages: the first stage compiles the binary, 
and the second stage copies the binary from the build container.

### Run

| Variable | Flag | Default | Desc |
| --- | --- |  --- |  --- |
| `CONFIG` | `--config` | `config.properties` | config file path |
| `LOGFILE` | `--logfile` | `` | log record file |
| `PORT` | `--port` | 9081 | server port |
| `DBUG` | `--debug` | false | debug |
| `MODE` | `--mode` | `parallel` | conn run mode |

## Change

When using a Docker container, you must first change the flags. Currently, it only uses flags and defaults. In a container, however, it is recommended to use environment variables.

The priority should be: `flag` > `env` > `default`, so that we can run the application locally or in a container.

The `logger` design also needs to be updated. If `logfile` is not specified, it should fall back to `stdout`.

## Vendor

Building the binary requires downloading dependencies, so it is recommended to use `vendor`.
Download the dependencies to the `vendor/` directory, and when building the binary, use `-mod=vendor` to tell Docker to use the vendor directory instead of downloading dependencies.

## File

Docker containers cannot directly access files or directories on the host due to permission issues. Use `:Z` when mounting volumes to resolve this.

## Ignore

The `ui` only needs to import the `static` package. Use `.dockerignore` to exclude unused directories.