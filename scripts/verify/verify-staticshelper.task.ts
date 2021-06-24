import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { Logger } from "tslog";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { staticsHelperAddress } from "../deploy/config/deploy-config-global";

task("verify-staticshelper", "Verify the staticshelper contract on Polygon Scan")
  .setAction(async (args, hre) => {
    assert(ethers.utils.getAddress(staticsHelperAddress) == staticsHelperAddress, "Cannot validate Invalid staticsHelperAddress");
    log.info("---------== verify-statichelper");

    await hre.run("verify:verify", {
        address: staticsHelperAddress
    });
});