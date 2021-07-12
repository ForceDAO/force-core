import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';

task("deploy-staticshelper", "Deploys a new Statics-Helper contract")
  .setAction(async (args, hre) => {

  log.info(`deploying statichelper on network: ${hre.network.name}`);
  const staticsHelperContract = await hre.ethers.getContractFactory(`contracts/helper/StaticsHelper.sol:StaticsHelper`);
  const staticsHelperContractInstance = await staticsHelperContract.deploy();
  await staticsHelperContractInstance.deployed();
  log.info(`copy ${staticsHelperContractInstance.address} to constant staticsHelperAddress of scripts/deploy/config/deploy-config-global.ts`);
});