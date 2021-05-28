import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import 'hardhat-deploy';
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "solidity-coverage"
require("@nomiclabs/hardhat-truffle5");
import { ethers } from "ethers";
require("@nomiclabs/hardhat-web3");
require('hardhat-contract-sizer');
require("dotenv").config();

require("./scripts/accounts.task.js");
require("./scripts/balance.task.js");
require("./scripts/balance2.task.ts");
require("./scripts/deploy01-Storage.task.js");
require("./scripts/deploy02-FarmRwToken.task.js");
require("./scripts/deploy03-FeeRewardForwarder.task.js");
require("./scripts/deploy04-Controller.task.js");
require("./scripts/deploy05-Vault.task.js");
require("./scripts/deploy15-NoMintRewardPool.task.js");
require("./scripts/deploy19-StaticsHelper.task");

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY;
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const MATICVIGIL_APP_ID = process.env.MATICVIGIL_APP_ID;

//---------------------==
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    polygonmumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_APP_ID}`,
      chainId: 80001,
      accounts: [`0x${POLYGON_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("10", "gwei").toNumber(),
      gas: 15e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    polygonmainnet: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${MATICVIGIL_APP_ID}`,
      chainId: 137,
      accounts: [`0x${POLYGON_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("10", "gwei").toNumber(),
      gas: 15e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("200", "gwei").toNumber(),
      gas: 7e6,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("20", "gwei").toNumber(),
      gas: 25e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${KOVAN_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("20", "gwei").toNumber(),
      gas: 25e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        }
      },
    ],
    overrides: {
      "contracts/Storage.sol": {
        version: "0.5.16",
        settings: { }
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    user1: 1,
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;