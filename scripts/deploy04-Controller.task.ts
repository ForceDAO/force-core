import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-controller", "Deploys a new Controller contract")
  .setAction(async (args, hre) => {
    log.info("---------== check args");
    const owner = process.env.OWNER || "";
    const treasury = process.env.TREASURY || "";
    const addrFarmRwToken = process.env.RWTOKEN || "";
    log.info("args:", args, "\nowner:", owner, "\ntreasury:", treasury, "\naddrFarmRwToken:", addrFarmRwToken);
    if(owner === "" || treasury === "" || addrFarmRwToken === "") {
      log.info("owner or treasury or addrFarmRwToken invalid");
      return;
    }

    log.info("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
    const addrStorage = instStorage.address;
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";

    log.info("---------== deploy-FeeRewardForwarder");
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check2");
    const instFeeRewardForwarder = await factoryFeeRwForwarder.deploy(addrStorage, owner, addrFarmRwToken);
    logDeployment(instFeeRewardForwarder, hre.network.name);
    const addrFeeRewardForwarder = instFeeRewardForwarder.address;
    //const addrFeeRewardForwarder = "0xde7B9F355231C33B2B425f1f107197Ba34a941B7";

    log.info("---------== deploy-Controller");
    log.info("args:", args, "\ntreasury:",treasury );
    ctrtName = "Controller";
    ctrtPath = "Controller";
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryController = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check3");
    const instController = await factoryController.deploy(
      addrStorage,
      addrFeeRewardForwarder
    );
    logDeployment(instController, hre.network.name);
    const addrController = instController.address;

    await instStorage.setController(addrController);
    log.info("check4");
  });

module.exports;
