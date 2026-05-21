.PHONY: run
run:
	go run . --config config.properties

.PHONY: run-single
run-single:
	go run . --config config-single.properties	

.PHONY: run-alpine
run-alpine:
	go run . --config config-alpine.properties --debug

.PHONY: run-alpine-problem-resolve
run-alpine-problem-resolve:
	go run . --config config-alpine-problem-resolve.properties --debug

.PHONY: run-local
run-local:
	go run . --config config-local.properties --debug

.PHONY: clean
clean:
	rm -rf bin

.PHONY: build
build: clean build/amd64 build/arm64 build/win build/macos
	
.PHONY: build/amd64	
build/amd64:
	@echo 'building linux_amd64...'
	cd ui && npm run build
	go mod tidy && go mod vendor
	mkdir -p bin 
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -mod=vendor -ldflags="-s -w" -o=bin/logs-viewer_amd64 .

.PHONY: build/arm64
build/arm64:
	@echo 'building linux_arm64...'
	cd ui && npm run build
	mkdir -p bin
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -mod=vendor -ldflags="-s -w" -o=bin/logs-viewer_arm64 .

.PHONY: build/win
build/win:
	@echo 'building windows...'
	cd ui && npm run build
	mkdir -p bin 
	GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -mod=vendor -ldflags="-s -w" -o=bin/logs-viewer_windows_amd64 .

.PHONY: build/macos
build/macos:
	@echo 'building macos...'
	cd ui && npm run build
	mkdir -p bin
	GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -mod=vendor -ldflags="-s -w" -o=bin/logs-viewer_darwin_arm64 .	

.PHONY: build/docker
build/docker:
	cd ui && npm run build
	docker build -f Dockerfile -t logs-viewer:0.1 .

.PHONY: run/docker
run/docker:
	docker rm -i logs-viewer
	docker run -d --name logs-viewer -p 9081:9081 -e CONFIG=config.properties -e LOGFILE=viewer.log -v ./config-alpine.properties:/config.properties:Z -v /tmp/logs:/logs:Z localhost/logs-viewer:0.1

.PHONY: run/docker
run/docker-host:
	docker rm -i logs-viewer
	docker run -d --name logs-viewer --network host -v ./config-alpine.properties:/config.properties:Z -v /tmp/logs:/logs:Z localhost/logs-viewer:0.1
