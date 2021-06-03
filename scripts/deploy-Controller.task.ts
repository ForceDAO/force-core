import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import * as Storage from "../build/contracts/Storage.json";

const log: Logger = new Logger();
require("dotenv").config();

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
    const addrStorage = process.env.STORAGE_CONTRACT_ADDRESS
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";
    const addrFeeRewardForwarder = process.env.FEE_REWARD_FORWARDER
    log.info("---------== deploy-Controller");
    const factoryController = await hre.ethers.getContractFactory(`contracts/Controller.sol:Controller`);
    const instController = await factoryController.deploy(
      addrStorage,
      addrFeeRewardForwarder
    );
    logDeployment(instController, hre.network.name);
    const addrController = instController.address;
    log.info(`Must Do Activity: ${addrController} gets in to .env as: CONTROLLER_ADDRESS`);

    // addrController gets in to .env as: CONTROLLER_ADDRESS

    //Load Storage Contract (deployed at address: addrStorage)
    let instStorage = new hre.ethers.Contract(addrStorage, Storage.abi);

    //set the controller address in instStorage
    await instStorage.setController(addrController);
  });

module.exports;
