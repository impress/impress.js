
# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# applications
NODE ?= node
ZUUL ?= $(NODE) $(BIN)/zuul

test:
	@if [ "x$(BROWSER_PLATFORM)" = "x" ]; then \
		$(ZUUL) \
		--ui mocha-bdd \
		--browser-name $(BROWSER_NAME) \
		--browser-version $(BROWSER_VERSION) \
		test/*.js; \
	else \
		$(ZUUL) \
		--ui mocha-bdd \
		--browser-name $(BROWSER_NAME) \
		--browser-version $(BROWSER_VERSION) \
		--browser-platform "$(BROWSER_PLATFORM)" \
		test/*.js; \
	fi

.PHONY: test
