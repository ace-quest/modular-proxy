"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpgradeableBeaconFactory = exports.getBeaconProxyFactory = exports.getProxyAdminFactory = exports.getITransparentUpgradeableProxyFactory = exports.getTransparentUpgradeableProxyFactory = exports.getProxyFactory = void 0;
const zAce = __importDefault(require("../zAce.json"));
async function getProxyFactory(hre, signer) {
    return hre.ethers.getContractFactory(zAce.default.abi, zAce.default.bytecode, signer);
}
exports.getProxyFactory = getProxyFactory;
