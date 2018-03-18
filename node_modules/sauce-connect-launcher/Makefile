SHELL = /bin/bash
export PATH := ./node_modules/.bin/:${PATH}

MAKEFLAGS += --no-print-directory --silent

# Shows available commands
help:
	make -qp | grep '^[^\# \n\\.]' | grep '^[a-z]' | grep -v '=' | cut -f1 -d ":" | sort

test: setup clean lint
	mocha --reporter spec $(MOCHAFLAGS)

# Lints the code
lint:
	@grunt jshint

all: setup
	grunt

dev: all
	grunt watch

clean:
	rm -rf sc/ \
		sauce_connect.log* \
		npm-debug.log


# Creates new releases by running these steps
#
# 1. bump the version in your package.json file.
# 2. stage the package.json file's change.
# 3. commit that change with a message like "release 0.6.22".
# 4. create a new git tag for the release.
# 5. push the changes out to github.
# 6. also push the new tag out to github.
# 7. publish to npm.
release: test clean
	rm -f user.json
	grunt release$(RELEASEFLAGS)

# Releases updating only the patch number 0.0.#
release-patch:
	@RELEASEFLAGS=":patch" make release

# Releases updating the minor number 0.#.0 and setting the patch to 0
release-minor:
	@RELEASEFLAGS=":minor" make release

# Releases updating the major number #.0.0 and setting the minor and patch to 0
release-major:
	@RELEASEFLAGS=":major" make release

# Installs npm dependencies
# There is no output on npm install as we will need to run this
# step when running CI tests
setup:
	test -d node_modules || (\
		echo "# Setting up dev environment (this might take a while). If something goes wrong, please run: npm install; npm rebuild; manually"; \
		npm install --silent > /dev/null; \
	true);
	make setup-sauce

setup-sauce:
	[[ $$SAUCE_ACCESS_KEY && $$SAUCE_USERNAME ]] || make generate-user-file

generate-user-file:
	test -f user.json || (\
		read -p "Sauce Labs Username: " name && \
		read -p "Sauce Labs Access key: " key && \
		echo "{\"username\": \"$$name\", \"accessKey\": \"$$key\"}" > user.json \
		)

# Version
version:
	node -e "console.log(require('./package.json').version)"

.PHONY: default test clean help setup release release-major release-minor release-patch
