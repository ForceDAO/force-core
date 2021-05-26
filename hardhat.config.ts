import { task, HardhatUserConfig } from "hardhat/config";
//import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import 'hardhat-deploy';
//import 'hardhat-deploy-ethers';
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "solidity-coverage"
require("@nomiclabs/hardhat-truffle5");
import { ethers } from "ethers";
require("@nomiclabs/hardhat-web3");
require('hardhat-contract-sizer');
require("dotenv").config();
const { logDeployment, toWei, fromWei } = require("./scripts/utils.js");
//const { deployContract } = require("./scripts/deploy1.js");

require("./scripts/accounts.task.js");
require("./scripts/balance.task.js");
require("./scripts/balance2.task.ts");
require("./scripts/deploy01-Storage.task.js");
require("./scripts/deploy02-ForceProfitSharing.task.js");
require("./scripts/deploy03-FeeRewardForwarder.task.js");
require("./scripts/deploy04-Controller.task.js");
require("./scripts/deploy05-Vault.task.js");
require("./scripts/deploy15-NoMintRewardPool.task.js");
require("./scripts/deploy19-StaticsHelper.task");

const mnemonic1 = process.env.MNEMONIC1 || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY;
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const MATICVIGIL_APP_ID = process.env.MATICVIGIL_APP_ID;

const networkID = process.env.NETWORKID;


const MAX_UNLOCK_SCHEDULES = 3;
const START_BONUS = 21;
const BONUS_PERIOD_SEC = 20250;
const INITIAL_SHARES_PER_TOKEN = 1000000;
const STORAGE_ADDRESS = "0x837b73e6e8F04e3E4685C41b9a8c6F2bebc9E70F";
const LP_TOKEN_ADDRESS = "0xB48E9b22Dace65F6A2B409871e154B85f4ED8B80";
const FORCE_TOKEN_ADDRESS = "0x2c31b10ca416b82cec4c5e93c615ca851213d48d";

const DURATION = 604800;//7 days in seconds
const REWARD_DISTRIBUTION = process.env.RINKEBY_ADDRESS;
const SOURCEVAULT = process.env.RINKEBY_ADDRESS;//used in migrate()
const MIGRATIONSTRATEGY = process.env.RINKEBY_ADDRESS;//used in pullFromStrategy


// //npx hardhat deploy-notifyHelper --network polygonmumbai
// task("deploy-notifyHelper", "Deploys a new contract")
// .setAction(
//   async (args, hre) => {
//     log1("---------== deploy-notifyHelper");
//     const contractName = "notifyHelper"
//     const contractPath = "notifyHelper";//strategies/sushiHODL
//     log1("contractPath:", contractPath, ", contractName:", contractName);
//     const factoryCtrt = await hre.ethers.getContractFactory(contractName);
//     log1("check1");
//     const arg1 = process.env.STORAGE_ADDRESS || "";
//     const arg2 = process.env.FEEREWARDFORWARDER || "";
//     const arg3 = process.env.FARM || "";
//     const instCtrt = await factoryCtrt.deploy(arg1, arg2, arg3);
//     logDeployment(instCtrt, network);
//     log1(
//       `npx hardhat verify --contract contracts/${contractPath}.sol:${contractName} --network ${network} ${arg1} ${arg2} ${arg3}`
//     );
//   }
// );


//---------------------==
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      // forking: {
      //   url: AlchemyApiKey,
      //   //url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      //   blockNumber: blockNumberX,
      // },
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
      //accounts: accounts()
    },
    polygonmumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_APP_ID}`,
      //url: `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 80001,
      accounts: [`0x${POLYGON_PRIVATE_KEY}`],
      gasPrice: 10e9,
      gas: 15e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },//gasPrice: 10e9, gas: 15e6}
    polygonmainnet: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${MATICVIGIL_APP_ID}`,
      //url: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 137,
      accounts: [`0x${POLYGON_PRIVATE_KEY}`],
      gasPrice: 10e9,
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
      gasPrice: 20e9,
      gas: 25e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${KOVAN_PRIVATE_KEY}`],
      gasPrice: 20e9,
      gas: 25e6,
      gasMultiplier: 10,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
    },
    // buidlerevm: {
    //   gas: 12000000,
    //   blockGasLimit: 0x1fffffffffffff,
    //   allowUnlimitedContractSize: true,
    //   timeout: 1800000
    // }
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
      "contracts/RewardPool.sol": {
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
  // contractSizer: {
  //   alphaSort: true,
  //   runOnCompile: true,
  //   disambiguatePaths: false,
  // }
};

export default config;
/**
  solidity: "0.5.16",
  solidity: {
    },
    compilers: [
      {
        version: "0.6.12",
        settings: { } 
      },
    ],
  },
 */