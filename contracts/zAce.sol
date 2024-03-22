// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import { AqModuleCore } from "./AqModuleCore.sol";

contract zAce is ERC1967Proxy, AqModuleCore {
    constructor(
        address implementation,
        bytes memory _data
    ) payable ERC1967Proxy(implementation, _data) {}

    function _implementation() internal view virtual override returns (address) {
        address mod = _getModuleAddress(msg.sig);

        return mod == address(0)
            ? super._implementation()
            : mod;
    }
}
