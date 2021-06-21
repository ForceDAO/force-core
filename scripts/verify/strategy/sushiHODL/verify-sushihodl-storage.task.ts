import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as deployConfig from "../../../deploy/config/deploy-config";
import { Logger } from "tslog";
const log: Logger = new Logger();


task("verify-sushihodl-storage", "Verify the sushi-HODL Strategy's Storage contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
  const {
        storageAddress
    } = deployConfig.deployedContracts;


  log.info("---------== verify-sushihodl-storage");

  await hre.run("verify:verify", {
    address: storageAddress
  })
});