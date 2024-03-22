// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AqModuleErrors {
    error InvalidModuleAddress(
        string modName,
        address prevModAddress,
        address nextModAddress
    );
    error ModuleNotExists(string modName);
}
