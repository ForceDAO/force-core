import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat verify-staticshelper --network polygonmainnet
task("verify-staticshelper", "Verify the staticshelper contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
    log.info("---------== verify-statichelper");

    await hre.run("verify:verify", {
        address: "0xC1f99f723C7bDF1313140BFA29390138F1b325bf"
    })
});