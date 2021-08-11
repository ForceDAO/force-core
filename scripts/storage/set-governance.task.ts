import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { storageAddress, governanceAddress }  from "../deploy/config/deploy-config-global";

task("set-governance", "set the governance to the Storage")
  .setAction(async (args, hre) => {
    assert(ethers.utils.getAddress(storageAddress) == ethers.utils.getAddress(storageAddress), "Invalid storageAddress");
    assert(ethers.utils.getAddress(governanceAddress) == ethers.utils.getAddress(governanceAddress), "Invalid governanceAddress");
    log.info(`Setting GovernanceAddress in storageAddress: ${storageAddress} with: ${governanceAddress}`);
    const storageInstance = await hre.ethers.getContractAt(
      "Storage",
      storageAddress
    );

    const setGovernanceTransaction = await storageInstance.setGovernance(
      governanceAddress
    );

    await setGovernanceTransaction.wait();

    const isGovernance = await storageInstance.isGovernance(governanceAddress);

    if(isGovernance){
     log.info(`Verification check is successful - for setGovernance on Storage: ${storageAddress} with GovernanceAddress:${governanceAddress}`);
    }else{
      log.error(`Verification check failed - for setGovernance  on Storage: ${storageAddress} with GovernanceAddress:${governanceAddress}`);
    }
});