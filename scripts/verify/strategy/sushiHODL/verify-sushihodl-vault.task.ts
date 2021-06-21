import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as deployConfig from "../../../deploy/config/deploy-config";
import { Logger } from "tslog";
const log: Logger = new Logger();


task("verify-sushihodl-vault", "Verify the sushi-HODL Strategy's Vault contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
  const {
        vaultAddress
    } = deployConfig.deployedContracts;


  log.info("---------== verify-sushihodl-vault");

  await hre.run("verify:verify", {
    address: vaultAddress
  })
});