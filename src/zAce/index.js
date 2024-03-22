"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");

(0, config_1.extendEnvironment)(hre => {
    hre.zAce = (0, plugins_1.lazyObject)(() => {
        return makeUpgradesFunctions(hre);
    });
});
function makeFunctions(hre, platform) {
    const { silenceWarnings, getAdminAddress, getImplementationAddress, getBeaconAddress, } = require('@openzeppelin/upgrades-core');
    const { makeDeployProxy } = require('./deploy-proxy');
    const { makeUpgradeProxy } = require('@openzeppelin/hardhat-upgrades/dist/upgrade-proxy');
    const { makeValidateImplementation } = require('@openzeppelin/hardhat-upgrades/dist/validate-implementation');
    const { makeValidateUpgrade } = require('@openzeppelin/hardhat-upgrades/dist/validate-upgrade');
    const { makeDeployImplementation } = require('@openzeppelin/hardhat-upgrades/dist/deploy-implementation');
    const { makePrepareUpgrade } = require('@openzeppelin/hardhat-upgrades/dist/prepare-upgrade');
    const { makeForceImport } = require('@openzeppelin/hardhat-upgrades/dist/force-import');
    return {
        silenceWarnings,
        deployProxy: makeDeployProxy(hre, platform),
        upgradeProxy: makeUpgradeProxy(hre, platform),
        validateImplementation: makeValidateImplementation(hre),
        validateUpgrade: makeValidateUpgrade(hre),
        deployImplementation: makeDeployImplementation(hre, platform),
        prepareUpgrade: makePrepareUpgrade(hre, platform),
        forceImport: makeForceImport(hre),
        erc1967: {
            getAdminAddress: (proxyAddress) => getAdminAddress(hre.network.provider, proxyAddress),
            getImplementationAddress: (proxyAddress) => getImplementationAddress(hre.network.provider, proxyAddress),
            getBeaconAddress: (proxyAddress) => getBeaconAddress(hre.network.provider, proxyAddress),
        },
    };
}
function makeUpgradesFunctions(hre) {
    return makeFunctions(hre, false);
}
