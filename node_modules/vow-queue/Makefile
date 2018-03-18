BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs

.PHONY: test
test:
	$(MOCHA) -u bdd -R spec --recursive

.PHONY: validate
validate: lint test

.PHONY: clean
clean:
	-rm -rf lib-cov
	-rm -rf html-report

.PHONY: lib-cov
lib-cov: clean
	$(ISTANBUL) instrument --output lib-cov --no-compact --variable global.__coverage__ lib

.PHONY: coverage
coverage: lib-cov
	VOW_QUEUE_COVERAGE=1 $(MOCHA) -u bdd --reporter mocha-istanbul
	@echo
	@echo Open html-report/index.html file in your browser

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .
