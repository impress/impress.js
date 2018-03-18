
# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# applications
NODE ?= node
NPM ?= $(NODE) $(shell which npm)
BROWSERIFY ?= $(NODE) $(BIN)/browserify
MOCHA ?= $(NODE) $(BIN)/mocha
ZUUL ?= $(NODE) $(BIN)/zuul

REPORTER ?= spec

all: dist/plist.js dist/plist-build.js dist/plist-parse.js

install: node_modules

clean:
	@rm -rf node_modules dist

dist:
	@mkdir -p $@

dist/plist-build.js: node_modules lib/build.js dist
	@$(BROWSERIFY) \
		--standalone plist \
		lib/build.js > $@

dist/plist-parse.js: node_modules lib/parse.js dist
	@$(BROWSERIFY) \
		--standalone plist \
		lib/parse.js > $@

dist/plist.js: node_modules lib/*.js dist
	@$(BROWSERIFY) \
		--standalone plist \
		--ignore lib/node.js \
		lib/plist.js > $@

node_modules: package.json
	@NODE_ENV= $(NPM) install
	@touch node_modules

test:
	@if [ "x$(BROWSER_NAME)" = "x" ]; then \
		$(MAKE) test-node; \
		else \
		$(MAKE) test-zuul; \
	fi

test-node:
	@$(MOCHA) \
		--reporter $(REPORTER) \
		test/*.js

test-zuul:
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

.PHONY: all install clean test test-node test-zuul
