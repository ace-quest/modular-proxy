"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeployProxy = void 0;
const upgrades_core_1 = require("@openzeppelin/upgrades-core");
const utils_1 = require("./utils");
const utils_2 = require("@openzeppelin/hardhat-upgrades/dist/platform/utils");
const contract_instance_1 = require("@openzeppelin/hardhat-upgrades/dist/utils/contract-instance");
function makeDeployProxy(hre, platformModule) {
    return async function deployProxy(ImplFactory, args = [], opts = {}) {
        if (!Array.isArray(args)) {
            opts = args;
            args = [];
        }
        opts = (0, utils_2.enablePlatform)(hre, platformModule, opts);
        const { provider } = hre.network;
        const manifest = await upgrades_core_1.Manifest.forNetwork(provider);
        const { impl, kind } = await (0, utils_1.deployProxyImpl)(hre, ImplFactory, opts);
        const contractInterface = ImplFactory.interface;
        const data = (0, utils_1.getInitializerData)(contractInterface, args, opts.initializer);
        if (kind === 'uups') {
            if (await manifest.getAdmin()) {
                (0, upgrades_core_1.logWarning)(`A proxy admin was previously deployed on this network`, [
                    `This is not natively used with the current kind of proxy ('uups').`,
                    `Changes to the admin will have no effect on this new proxy.`,
                ]);
            }
        }
        let proxyDeployment;
        switch (kind) {
            case 'uups': {
                const ProxyFactory = await (0, utils_1.getProxyFactory)(hre, ImplFactory.signer);
                proxyDeployment = Object.assign({ kind }, await (0, utils_1.deploy)(hre, opts, ProxyFactory, impl, data));
                break;
            }
        }
        await manifest.addProxy(proxyDeployment);
        return (0, contract_instance_1.getContractInstance)(hre, ImplFactory, opts, proxyDeployment);
    };
}
exports.makeDeployProxy = makeDeployProxy;
