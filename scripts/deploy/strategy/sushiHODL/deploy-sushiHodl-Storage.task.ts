import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-storage --network polygonmumbai
task("deploy-sushiHODL-storage", "Deploys a new Storage contract For sushiHODL")
.setAction(
  async (args, hre) => {
    log.info("---------== deploy-sushiHODL-Storage");
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/Storage.sol:Storage`);
    const instStorage = await factoryStorage.deploy();
    log.info(`--------- Must Do Activity: ${instStorage} gets in to .env as: STORAGE_CONTRACT_ADDRESS --------- `);
    logDeployment(instStorage, hre.network.name);

    console.log(
      `npx hardhat verify --contract contracts/Storage.sol:Storage --network ${hre.network.name} ${instStorage.address}`
    );//npx hardhat verify --contract contracts/Storage.sol:Storage --network ${network} 0x75c8...
  
  }
);

module.exports;
