import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
require("@nomiclabs/hardhat-ethers");
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "solidity-coverage"
require("@nomiclabs/hardhat-truffle5");
import { ethers } from "ethers";
require("@nomiclabs/hardhat-web3");
require('hardhat-contract-sizer');

require("dotenv").config();
const { logDeployment, toWei, fromWei } = require("./test_fork/utils");
//const { deployContract } = require("./scripts/deploy1.js");

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY;
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const MATICVIGIL_APP_ID = process.env.MATICVIGIL_APP_ID;

let AlchemyApiKey = "", blockNumberX = 0, network = "";
const log1 = console.log;
const forkNetworkID = process.env.FORKNETWORKID;
//log1("forkNetworkID:", forkNetworkID);
if(forkNetworkID === "1" || forkNetworkID === undefined){
  AlchemyApiKey = process.env.ALCHEMY_API_KEY_MAIN || "";
  blockNumberX = 12380002;
  //log1("fork Mainnet")
} else if(forkNetworkID === "4"){
  AlchemyApiKey = process.env.ALCHEMY_API_KEY_RINKEBY || "";
  blockNumberX = 8541595;
  //log1("fork Rinkeby")
} else if(forkNetworkID === "4"){
  AlchemyApiKey = process.env.ALCHEMY_API_KEY_KOVAN || "";
  blockNumberX = 8541595;
  //log1("fork KOVAN")
}
const networkID = process.env.NETWORKID;
if(networkID === "4"){
  network = "rinkeby";
} else if(networkID === "42"){
  network = "kovan";
} else if(networkID === "137"){
  network = "polygonmainnet";
} else if(networkID === "80001"){
  network = "polygonmumbai";
} else {
  console.log("networkID invalid");
  process.exit(1);
}

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

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-geyser", "Deploys new geyser contract").setAction(
  async (args, hre) => {
    // We get the contract to deploy
    const Geyser = await hre.ethers.getContractFactory("TokenGeyser");
    const geyser = await Geyser.deploy(
      LP_TOKEN_ADDRESS,
      FORCE_TOKEN_ADDRESS,
      MAX_UNLOCK_SCHEDULES,
      START_BONUS,
      BONUS_PERIOD_SEC,
      INITIAL_SHARES_PER_TOKEN,
      STORAGE_ADDRESS
    );

    console.log("Geyser deployed to:", geyser.address);
    console.log(
      `npx hardhat verify --contract contracts/geyser/TokenGeyser.sol:TokenGeyser --network rinkeby ${geyser.address} ${LP_TOKEN_ADDRESS} ${FORCE_TOKEN_ADDRESS} ${MAX_UNLOCK_SCHEDULES} ${START_BONUS} ${BONUS_PERIOD_SEC} ${INITIAL_SHARES_PER_TOKEN} ${STORAGE_ADDRESS}`
    );
  }
);

task("deploy-rewardpool", "Deploys new rewardpool contract").setAction(
  async (args, hre) => {
    console.log("---------== Task: deploy-rewardpool")
    const factoryCtrt = await hre.ethers.getContractFactory("NoMintRewardPool");
    const ctrt = await factoryCtrt.deploy(
      FORCE_TOKEN_ADDRESS,
      LP_TOKEN_ADDRESS,
      DURATION,
      REWARD_DISTRIBUTION,
      STORAGE_ADDRESS,
      SOURCEVAULT,
      MIGRATIONSTRATEGY
    );

    console.log("deployed to:", ctrt.address);
    console.log(
      `npx hardhat verify --contract contracts/RewardPool.sol:NoMintRewardPool --network ${network} ${ctrt.address} ${FORCE_TOKEN_ADDRESS} ${LP_TOKEN_ADDRESS} ${DURATION} ${REWARD_DISTRIBUTION} ${STORAGE_ADDRESS} ${SOURCEVAULT} ${MIGRATIONSTRATEGY}`
    );
  }
);

//npx hardhat deploy-SushiHodlStrategyRinkeby_DAI_WETH_Factory --network rinkeby
task("deploy-SushiHodlStrategyRinkeby_DAI_WETH_Factory", "Deploys new SushiHodlStrategyRinkeby_DAI_WETH_Factory contract").setAction(
  async (args, hre) => {
    console.log("---------== Task: deploy-SushiHodlStrategyRinkeby_DAI_WETH_Factory")
    const factoryCtrt = await hre.ethers.getContractFactory("SushiHodlStrategyRinkeby_DAI_WETH_Factory");
    const storage = "0xB1A1D3f737726A6eED2fa2157ec5dFad39cbC156"
    const ctrt = await factoryCtrt.deploy(storage);
    console.log("deployed to:", ctrt.address);
    console.log(
      `npx hardhat verify --contract contracts/sushiHODL/SushiHodlStrategyRinkeby_DAI_WETH_Factory.sol:SushiHodlStrategyRinkeby_DAI_WETH_Factory --network ${network} ${ctrt.address} ${storage}`
    );
    //const addrNew = await ctrt.newSushiHodlStrategyRinkeby_DAI_WETH();
    //console.log("addrNew:", addrNew);
  }
);

//npx hardhat balance --account 0xabc123
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (args, hre) => {
    const provider = new ethers.providers.JsonRpcProvider(`https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`);
    log1("provider acquired");
    log1(args.account);
    const balance = await provider.getBalance(args.account);
    log1(ethers.utils.formatEther(balance));
  });

//Try to run scripts ... failed due to importing hre inside the script while running hardhat config

//npx hardhat deploy-strategy --network rinkeby --symbol usdc
task("deploy-strategy", "Deploys new USDC contract")
.addParam("symbol", "strategy symbol")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-strategy");
    log1("symbol: "+args.symbol);
    let contractPath: string, contractName: string;
    if(args.symbol === "usdc"){
      contractName = "IdleStrategyUSDCMainnet"
      contractPath = "strategies/idle/IdleStrategyUSDCMainnet"
    } else if(args.symbol === "usdt"){
      contractName = "IdleStrategyUSDTMainnet"
      contractPath = "strategies/idle/IdleStrategyUSDTMainnet"
    
    } else if(args.symbol === "dai"){
      contractName = "IdleStrategyDAIMainnet"
      contractPath = "strategies/idle/IdleStrategyDAIMainnet"
    
    } else if(args.symbol === "3crv"){
      contractName = "CRVStrategy3PoolMainnet"
      contractPath = "CRVStrategy3PoolMainnet"
    
    } else if(args.symbol === "ethusdc" || args.symbol === "ethusdt" || args.symbol === "ethdai"){
      contractName = "SushiMasterChefLPStrategy"
      contractPath = "strategies/sushiswap/SushiMasterChefLPStrategy"
    } else {
      log1("invalid argument");
      process.exit(1);
    }
    log1("contractPath:", contractPath, ", contractName:", contractName);
    const factoryCtrt = await hre.ethers.getContractFactory(contractName);
    log1("check2");
    const ctrt = await factoryCtrt.deploy(STORAGE_ADDRESS, SOURCEVAULT);
    log1("contract deployed to:", ctrt.address);
    log1(
      `npx hardhat verify --contract contracts/${contractPath}.sol:${contractName} --network ${network} ${STORAGE_ADDRESS} ${SOURCEVAULT}`
    );
  }
);

//npx hardhat deploy-SushiHodlStrategyFactory --network polygonmumbai
task("deploy-SushiHodlStrategyFactory", "Deploys a new contract")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-SushiHodlStrategyFactory");
    const contractName = "SushiHodlStrategyFactory"
    const contractPath = "strategies/sushiHODL/SushiHodlStrategyFactory"
    log1("contractPath:", contractPath, ", contractName:", contractName);
    const factoryCtrt = await hre.ethers.getContractFactory(contractName);
    log1("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, network);
    log1(
      `npx hardhat verify --contract contracts/${contractPath}.sol:${contractName} --network ${network}`
    );
  }
);

//npx hardhat transferToken --network polygonmumbai --amount 12
task("transferToken", "Transfer token")
.addParam("amount", "amount")
.setAction(
  async (args, hre) => {
    log1("---------== transferToken");
    const contractName = "ERC20PresetFixedSupply"
    const contractPath = "ERC20PresetFixedSupply"
    const addrCtrt = "0xB1A1D3f737726A6eED2fa2157ec5dFad39cbC156"
    const addrUser3 = process.env.USER3ADDR;
    const addrTo = process.env.USER4ADDR;
    const amount = toWei(args.amount);
    log1("contractName:", contractName, ", contractPath:", contractPath, "\nargs.amount:", args.amount,", addrTo:", addrTo, ", addrCtrt:", addrCtrt);
    
    //log1("hre.ethers:", hre.ethers);
    const [user0] = await hre.ethers.getSigners();
    //log1("user0:", user0)
    const user0Addr = user0.address;//await user0.getAddress();
    const balanceETH = await user0.getBalance();
    log1("user0:", user0Addr, ", balanceETH:", fromWei(balanceETH));

    const instCtrt = await hre.ethers.getContractAt(contractName, addrCtrt);//user0
    log1("check1");
    const tokenName= await instCtrt.name();
    log1("tokenName:", tokenName);
    const balance1 = await instCtrt.balanceOf(addrUser3);
    log1("balance1:", fromWei(balance1));

    const txn1 = await instCtrt.transfer(addrTo, amount);
    //, {gasPrice: 10e9, gasLimit: 1e6}
    log1("transfer txn1:", txn1, "\ngasPrice:", txn1.gasPrice.toString(), ", gasLimit:", txn1.gasLimit.toString());

    log1(`https://explorer-mumbai.maticvigil.com/tx/${txn1.hash}/internal-transactions`)
  }
);

//npx hardhat createSushiHodlStrategy --network polygonmumbai --storage 0xe5C48f9ef1A1a9491CbeB8585aaFA63117860b1A --underlyingpair 0x6FF62bfb8c12109E8000935A6De54daD83a4f39f --vault 0xcB42040847da4771413F219b293F5df90C797E2B --masterchef 0x80C7DD17B01855a6D2347444a0FCC36136a314de --sushitoken 0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a --poolid 2 --fsushi 0x38745eab5b545CE76a9697562c920FFa06b26170
task("createSushiHodlStrategy", "Deploys a new contract")
.addParam("storage", "storage")
.addParam("underlyingpair", "underlyingpair")
.addParam("vault", "vault")
.addParam("masterchef", "masterchef")
.addParam("sushitoken", "sushitoken")
.addParam("poolid", "poolid integer")
.addParam("fsushi", "fsushi")
.setAction(
  async (args, hre) => {
    log1("---------== createSushiHodlStrategy");
    log1("storage: "+args.storage);
    log1("underlyingpair: "+args.underlyingpair);
    log1("vault: "+args.vault);
    log1("masterchef: "+args.masterchef);
    log1("sushitoken: "+args.sushitoken);
    log1("poolid: "+args.poolid);
    log1("fsushi: "+args.fsushi);
    const contractName = "SushiHodlStrategyFactory"
    const contractPath = "strategies/sushiHODL/SushiHodlStrategyFactory"
    log1("contractPath:", contractPath, ", contractName:", contractName);

    const addrSushiHodlStrategyFactory = process.env.SUSHIHODLSTRATEGYFACTORY || "";
    const nodeUrlRpc = process.env.SUSHIHODLSTRATEGYFACTORY || "";
    const networkID = process.env.NETWORKID;
    if(networkID === "4"){
      network = "rinkeby";
    } else if(networkID === "42"){
      network = "kovan";
    } else if(networkID === "137"){
      network = "polygonmainnet";
    } else if(networkID === "80001"){
      network = "polygonmumbai";
    } else {
      log1("networkID invalid");
      process.exit(1);
    }
    log1("\nNetworkID:", networkID, ", network:", network);

    //const [user0] = await hre.ethers.getSigners();
    const instCtrt = await hre.ethers.getContractAt("SushiHodlStrategyFactory", addrSushiHodlStrategyFactory);

    log1("check2");
    const txn = await instCtrt.createSushiHodlStrategy(args.storage, args.underlyingpair, args.vault, args.masterchef, args.sushitoken, args.poolid, args.fsushi);//, {gasLimit: 15e6}
    log1("createSushiHodlStrategy txn:", txn, ", gasLimit:", txn.gasLimit.toString() );
    log1(`https://explorer-mumbai.maticvigil.com/tx/${txn.hash}/internal-transactions`)

  }
);

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
      forking: {
        url: AlchemyApiKey,
        //url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
        blockNumber: blockNumberX,
      },
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff,
      //accounts: accounts()
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
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("200", "gwei").toNumber(),
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
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      {
        version: "0.5.16"
      },
    ],
    overrides: {
      "contracts/strategies/idleTokenHelper.sol": {
        version: "0.6.12",
        settings: { }
      },
      "contracts/ERC20PresetFixedSupply.sol": {
        version: "0.8.4",
        settings: { }
      }
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