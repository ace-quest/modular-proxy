ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
HARDHAT  := $(ROOT_DIR)/node_modules/.bin/hardhat

.PHONY: build-zAce

build-zAce:
	@$(HARDHAT) compile
	cd $(ROOT_DIR)/artifacts/contracts/zAce.sol && \
		jq .buildInfo zAce.dbg.json | xargs -I {} jq .input {} > $(ROOT_DIR)/src/zAce/build-info.json
	cp $(ROOT_DIR)/artifacts/contracts/zAce.sol/zAce.json $(ROOT_DIR)/src/zAce/zAce.json
