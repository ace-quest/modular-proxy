import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-abi-exporter'
import { config as dotenvConfig } from 'dotenv'
import { Wallet } from 'ethers'
import { resolve } from 'path'

import type { HardhatUpgrades, PlatformHardhatUpgrades } from '@openzeppelin/hardhat-upgrades/src';

dotenvConfig({ path: resolve(__dirname, './.env') })

/**
 * @dev Priority:
 *   1. env: MNEMONIC
 *   2. env: KEY
 *   3. generate random accounts
 */
const accounts = (function getAccounts(mnemonic = '', privateKey = '') {
  if (mnemonic) {
    return {
      count: 10,
      mnemonic,
    }
  }

  if (privateKey) return [privateKey]

  console.log('Not assign secrets from environment variables, generate random accounts...')
  const wallet = Wallet.createRandom()
  return {
    count: 10,
    mnemonic: wallet.mnemonic!.phrase,
  }
})(process.env.MNEMONIC, process.env.KEY)

const config: HardhatUserConfig = {
  defaultNetwork: process.env.DEFAULT_NETWORK ?? 'hardhat',
  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: './contracts',
  },
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: '10000000000000000000000000',
      },
      chainId: 31337,
    },
    'opbnb:testnet': {
      accounts,
      chainId: 5_611,
      url: `https://opbnb-testnet-rpc.bnbchain.org`,
      gasPrice: 1500000008, // 1.500000008 gwei
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    compilers: [
      //////// 注意: 目前 opBNB testnet 在 bnbscan verify 時最多只能選用到 0.8.20 的 compiler, 要調整前請先確認!!
      {
        version: '0.8.20',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: 'none',
          },
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
          // evmVersion: 'default',
        },
      },
    ],
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5',
  },
  abiExporter: {
    path: './build/abi',
    format: 'json',
    spacing: 2,
    clear: true,
    flat: true,
  },
  etherscan: {
    apiKey: {
      // 'linea:mainnet': process.env.LINEA_MAINNET_ETHERSCAN_API_KEY ?? '',
    },
  },
}

export default config

// declare module 'hardhat/types/runtime' {
//   export interface HardhatRuntimeEnvironment {
//     upgrades: HardhatUpgrades;
//     platform: PlatformHardhatUpgrades;
//     zg: HardhatUpgrades;
//   }
// }
