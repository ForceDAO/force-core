import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { storageAddress, controllerAddress }  from "../deploy/config/deploy-config-global";

task("set-controller", "set the controller to the Storage")
  .setAction(async (args, hre) => {
    assert(ethers.utils.getAddress(storageAddress) == ethers.utils.getAddress(storageAddress), "Invalid storageAddress");
    assert(ethers.utils.getAddress(controllerAddress) == ethers.utils.getAddress(controllerAddress), "Invalid controllerAddress");
    log.info(`Setting ControllerAddress in storageAddress: ${storageAddress} with: ${controllerAddress}`);
    const storageInstance = await hre.ethers.getContractAt(
      "Storage",
      storageAddress
    );

    const setControllerTransaction = await storageInstance.setController(
      controllerAddress
    );

    await setControllerTransaction.wait();

    const isController = await storageInstance.isController(controllerAddress);

    if(isController){
     log.info(`Verification check is successful - for setController on Storage: ${storageAddress} with ControllerAddress:${controllerAddress}`);
    }else{
      log.error(`Verification check failed - for setController  on Storage: ${storageAddress} with ControllerAddress:${controllerAddress}`);
    }
});