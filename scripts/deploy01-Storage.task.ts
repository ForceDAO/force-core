import { logDeployment } from "./utils";
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
    const ctrtName = "Storage"
    const ctrtPath = "Storage"
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check2");
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
  }
);

module.exports;
