import { logDeployment } from "./utils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-controller", "Deploys a new Controller contract")
  .setAction(async (args, hre) => {
    log1("---------== check args");
    const owner = process.env.OWNER || "";
    const treasury = process.env.TREASURY || "";
    const addrFarmRwToken = process.env.RWTOKEN || "";
    log1("args:", args, "\nowner:", owner, "\ntreasury:", treasury, "\naddrFarmRwToken:", addrFarmRwToken);
    if(owner === "" || treasury === "" || addrFarmRwToken === "") {
      log1("owner or treasury or addrFarmRwToken invalid");
      return;
    }

    log1("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
    const addrStorage = instStorage.address;
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";

    log1("---------== deploy-FeeRewardForwarder");
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instFeeRewardForwarder = await factoryFeeRwForwarder.deploy(addrStorage, owner, addrFarmRwToken);
    logDeployment(instFeeRewardForwarder, hre.network.name);
    const addrFeeRewardForwarder = instFeeRewardForwarder.address;
    //const addrFeeRewardForwarder = "0xde7B9F355231C33B2B425f1f107197Ba34a941B7";

    log1("---------== deploy-Controller");
    log1("args:", args, "\ntreasury:",treasury );
    ctrtName = "Controller";
    ctrtPath = "Controller";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryController = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check3");
    const instController = await factoryController.deploy(
      addrStorage,
      addrFeeRewardForwarder
    );
    logDeployment(instController, hre.network.name);
    const addrController = instController.address;

    await instStorage.setController(addrController);
    log1("check4");
  });

module.exports;
