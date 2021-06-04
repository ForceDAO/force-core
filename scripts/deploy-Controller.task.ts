import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";

const log: Logger = new Logger();
require("dotenv").config();
import * as deployConfig from "./deploy-config";

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-controller", "Deploys a new Controller contract")
  .setAction(async (args, hre) => {
    
    const Storage = require("../build/contracts/Storage.json")

    log.info("---------== check args");
    const owner = process.env.OWNER || "";
    const treasury = process.env.TREASURY || "";
    const addrFarmRwToken = process.env.RWTOKEN || "";
    log.info("args:", args, "\nowner:", owner, "\ntreasury:", treasury, "\naddrFarmRwToken:", addrFarmRwToken);
    if(owner === "" || treasury === "" || addrFarmRwToken === "") {
      log.info("owner or treasury or addrFarmRwToken invalid");
      return;
    }
    const addrStorage = deployConfig.deployedContracts.storageAddress || "";
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";

    if(addrStorage === "" ) {
      log.error("storageAddress invalid");
      return;
    }

    const addrFeeRewardForwarder = deployConfig.deployedContracts.feeRewardForwarderAddress || "";

    if(addrFeeRewardForwarder === "" ) {
      log.error("feeRewardForwarderAddress invalid");
      return;
    }

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
