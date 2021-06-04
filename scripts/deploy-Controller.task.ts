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

    // https://ethereum.stackexchange.com/questions/95023/hardhat-how-to-interact-with-a-deployed-contract

    //Load Storage Contract (deployed at address: addrStorage)
    const accounts = await hre.ethers.getSigners();
    const StorageContractJSON = require("../build/contracts/Storage.json")   
    let instStorage = new hre.ethers.Contract(addrStorage, StorageContractJSON.abi, accounts[0]);

    //set the controller address in instStorage
    await instStorage.setController(addrController);
  });

module.exports;
