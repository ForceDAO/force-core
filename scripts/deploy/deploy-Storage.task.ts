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
    
    logger.info("Deployment log for network: ", hre.network.name);
    logger.info("Deployed address:", instStorage.address);
  }
);