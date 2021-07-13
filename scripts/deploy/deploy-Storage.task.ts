import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";

const logger: Logger = new Logger();

task("deploy-storage", "Deploys a new Storage contract")
.setAction(
  async (args, hre) => {
    logger.info("Deploying Storage.sol");
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/Storage.sol:Storage`);
    const instStorage = await factoryStorage.deploy();
    await instStorage.deployed();
    logger.info(`copy ${instStorage.address} to deploy-config-global.ts as: storageAddress`);
  }
);