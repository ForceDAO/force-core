import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { Logger } from "tslog";
const log: Logger = new Logger();

task("verify-staticshelper", "Verify the staticshelper contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
    log.info("---------== verify-statichelper");

    await hre.run("verify:verify", {
        address: "0x9A38bC56D3A81B7A8B73450c277891D4900c5870"
    })
});