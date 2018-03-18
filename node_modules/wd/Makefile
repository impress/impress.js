
DEFAULT:
	@echo
	@echo '  mapping -> build the mapping (implemented only).'
	@echo '  full_mapping -> build the mapping (full).'
	@echo '  unsupported_mapping -> build the mapping (unsupported).'
	@echo ''
	@echo 'Notes:'
	@echo '  - For midway and e2e test, BROWSER=[chrome|firefox|explorer|multi].'
	@echo '  - To test on sauce, set SAUCE_USERNAME/SAUCE_ACCESS_KEY first'
	@echo ''
	@echo 'Mobile test targets: '
	@echo '  test_ios test_iphone test_ipad'
	@echo '  test_android test_android_phone test_android_tablet'

# test_sauce:
# 	BROWSER=multi make test_unit test_midway_sauce_connect
# 	BROWSER=chrome make test_midway_sauce_connect test_e2e_sauce
# 	BROWSER=firefox make test_midway_sauce_connect test_e2e_sauce


# test_travis:
# ifeq ($(MULTI),true)
# 	make jshint
# 	make test_unit
# ifneq ($(TRAVIS_PULL_REQUEST),false)
# 	@echo 'Skipping Sauce Labs tests as this is a pull request'
# else
# 	@echo make test_midway_sauce_connect
# endif
# else 
# ifneq ($(TRAVIS_PULL_REQUEST),false)
# 	@echo 'Skipping Sauce Labs tests as this is a pull request'
# else
# ifeq ($(BROWSER),all_androids)
# 	BROWSER=android_tablet make test_midway_mobile_sauce_connect
# 	BROWSER=android_phone make test_midway_mobile_sauce_connect
# else ifeq ($(MOBILE),true)
# 	make test_midway_mobile_sauce_connect
# else
# 	make test_midway_sauce_connect
# 	make test_e2e_sauce
# endif
# endif
# endif

# test_coverage:
# 	rm -rf coverage
# 	./node_modules/.bin/istanbul cover test/coverage/run_tests.js --

_dox:
	@mkdir -p tmp
	@./node_modules/.bin/dox -r < lib/webdriver.js > tmp/webdriver-dox.json
	@./node_modules/.bin/dox -r < lib/element.js > tmp/element-dox.json
	@./node_modules/.bin/dox -r < lib/commands.js > tmp/commands-dox.json
	@./node_modules/.bin/dox -r < lib/element-commands.js > tmp/element-commands-dox.json
	@./node_modules/.bin/dox -r < lib/main.js > tmp/main-dox.json
	@./node_modules/.bin/dox -r < lib/asserters.js > tmp/asserters-dox.json

# build the mapping (implemented only)
mapping: _dox
	@node doc/mapping-builder.js

# build the mapping (full)
full_mapping: _dox
	@node doc/mapping-builder.js full

# build the mapping (unsupported)
unsupported_mapping: _dox
	@node doc/mapping-builder.js unsupported

.PHONY: \
	DEFAULT \
	mapping \
	full_mapping \
	unsupported_mapping \
	_dox
