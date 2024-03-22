// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AqModuleErrors } from "./AqModuleErrors.sol";

contract AqModuleCore is AqModuleErrors {
        /// @custom:storage-location erc7201:ace-quest.module
    struct ModuleStorage {
        // mod hash => mod address
        mapping(bytes32 => address) _modules;
        // function sigHash => mod hash
        mapping(bytes4 => bytes32) _modInterfaces;
    }

    // keccak256(abi.encode(uint256(keccak256("ace-quest.module")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ModulesStorageLocation = 0x3619734fad8f6b303a1cd5b2fe8b4f2bac0a6b120c1b4ab21b3a2db144ca6900;

    event ModuleUpdated(string name, address module);
    event ModuleFunctionAttached(string name, bytes4 sig);
    event ModuleFunctionDetached(bytes4 sig);

    function _getModuleStorage() private pure returns (ModuleStorage storage $) {
        assembly {
            $.slot := ModulesStorageLocation
        }
    }

    function _getModuleAddress(bytes4 sig) internal view returns (address) {
        ModuleStorage storage $ = _getModuleStorage();
        return $._modules[$._modInterfaces[sig]];
    }

    function _setModule(
        string memory modName,
        address modAddress,
        bytes4[] memory modInterfaces
    ) internal {
        ModuleStorage storage $ = _getModuleStorage();
        bytes32 modHash = keccak256(bytes(modName));

        if (modAddress == address(0)) {
            revert InvalidModuleAddress(
                modName,
                $._modules[modHash],
                modAddress
            );
        }

        $._modules[modHash] = modAddress;
        emit ModuleUpdated(modName, modAddress);

        _attachInterfaces(modName, modInterfaces);
    }

    function _unsetModule(
        string memory modName,
        bytes4[] memory interfaces
    ) internal {
        ModuleStorage storage $ = _getModuleStorage();
        bytes32 modHash = keccak256(bytes(modName));
        if ($._modules[modHash] == address(0)) {
            revert ModuleNotExists(modName);
        }

        delete $._modules[modHash];
        emit ModuleUpdated(modName, address(0));

        _detachInterfaces(interfaces);
    }

    function _attachInterfaces(
        string memory modName,
        bytes4[] memory modInterfaces
    ) internal {
        ModuleStorage storage $ = _getModuleStorage();

        bytes32 modHash = keccak256(bytes(modName));
        for (uint256 i = 0; i < modInterfaces.length; i++) {
            $._modInterfaces[modInterfaces[i]] = modHash;
            emit ModuleFunctionAttached(modName, modInterfaces[i]);
        }
    }

    function _detachInterfaces(
        bytes4[] memory modInterfaces
    ) internal {
        ModuleStorage storage $ = _getModuleStorage();

        for (uint256 i = 0; i < modInterfaces.length; i++) {
            delete $._modInterfaces[modInterfaces[i]];
            emit ModuleFunctionDetached(modInterfaces[i]);
        }
    }
}
