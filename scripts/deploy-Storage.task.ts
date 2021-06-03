import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-storage --network polygonmumbai
task("deploy-storage", "Deploys a new Storage contract")
.setAction(
  async (args, hre) => {
    log.info("---------== deploy-Storage");
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/Storage.sol:Storage`);
    const instStorage = await factoryStorage.deploy();
    log.info(`--------- Must Do Activity: ${instStorage} gets in to .env as: STORAGE_CONTRACT_ADDRESS --------- `);
    logDeployment(instStorage, hre.network.name);
  }
);

module.exports;
