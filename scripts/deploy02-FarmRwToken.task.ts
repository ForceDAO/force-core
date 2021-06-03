import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-farmRwToken --network polygonmumbai
// farm === IRewardPool(_pool).rewardToken(),
task("deploy-farmRwToken", "Deploys a new FarmRwToken contract")
.setAction(
  async (args, hre) => {
    // const storage = process.env.STORAGE || "";
    // log.info("storage:", storage);
    // if(storage === "") {
    //   log.info("storage invalid");
    //   return;
    // }
    log.info("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
    //.addParam("storage", "storage")
    const addrStorage = instStorage.address;
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";

    log.info("---------== deploy-FarmRwToken");
    ctrtName = "RewardToken";
    ctrtPath = "RewardToken";
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFarmRwToken = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check2");
    const instFarmRwToken = await factoryFarmRwToken.deploy(addrStorage);
    logDeployment(instFarmRwToken, hre.network.name);
    const addrFarmRwToken = "0x27CfC18Df50dc0D4e0EBF8CFad66622A08611FC9";
    //const addrFarmRwToken = instFarmRwToken.address;

  }
);

module.exports;
