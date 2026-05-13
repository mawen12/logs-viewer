run:
	go run . --config config.properties

run-single:
	go run . --config config-single.properties	

run-alpine:
	go run . --config config-alpine.properties --debug

clean:
	rm -rf bin

build: clean build/amd64 build/arm64 build/win build/macos
	
build/amd64: clean
	@echo 'building linux_amd64...'
	mkdir -p bin && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w" -o=bin/logs-viewer_amd64 .

build/arm64:
	@echo 'building linux_arm64...'
	mkdir -p bin && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -o=bin/logs-viewer_arm64 .

build/win:
	@echo 'building windows...'
	mkdir -p bin && GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w" -o=bin/logs-viewer_windows_amd64 .

build/macos:
	@echo 'building windows...'
	mkdir -p bin && GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -o=bin/logs-viewer_darwin_arm64 .	
