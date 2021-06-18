import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import * as deployConfig from "./config/deploy-config";
import { strict as assert } from 'assert';

// npx hardhat compile
// npx hardhat deploy-staticshelper --network polygonmainnet
task("deploy-staticshelper", "Deploys a new Statics-Helper contract")
  .setAction(async (args, hre) => {

  log.info(`---------== deploy-statichelper on network: ${hre.network.name}`);
  const staticsHelperContract = await hre.ethers.getContractFactory(`contracts/helper/StaticsHelper.sol:StaticsHelper`);
  const staticsHelperContractInstance = await staticsHelperContract.deploy();
  log.info(`--------- Must Do Activity: ${staticsHelperContractInstance.address} deploy-config.ts as: staticsHelper --------- `);
});