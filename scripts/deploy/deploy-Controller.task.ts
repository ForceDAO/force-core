import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as deployConfig from "../config/deploy-config";
const fs = require('fs');
import {  readFileSync } from 'fs';
const StorageABIPath = "../artifacts/contracts/Storage.sol/Storage.json";

const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-controller", "Deploys a new Controller contract")
  .setAction(async (args, hre) => {
    
    const addrStorage = deployConfig.deployedContracts.storageAddress || "";

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

    // https://ethereum.stackexchange.com/questions/95023/hardhat-how-to-interact-with-a-deployed-contract

    
    if(fs.existsSync(StorageABIPath)){
      let storageJSON = JSON.parse(readFileSync(StorageABIPath).toString());

      //Load Storage Contract (deployed at address: addrStorage)
      const accounts = await hre.ethers.getSigners();

      let instStorage = new hre.ethers.Contract(addrStorage, storageJSON.abi, accounts[0]);

      //set the controller address in instStorage
      await instStorage.setController(addrController);
      
    }else{
      log.error("ABI for Storage contract cannot be located @ path: "+StorageABIPath);
    }
  });

module.exports;
