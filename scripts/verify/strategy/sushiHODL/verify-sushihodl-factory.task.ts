import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { ethers } from "ethers";
require("dotenv").config();
import { sushiHodlStrategyFactoryAddress } from "../../../deploy/config/deploy-config-global";
import { strict as assert } from 'assert';
import { Logger } from "tslog";
const log: Logger = new Logger();

task("verify-sushihodl-factory", "Verify the sushi-HODL Strategy's Factory contract on Polygon Scan")
  .setAction(async (args, hre) => {
    assert(ethers.utils.getAddress(sushiHodlStrategyFactoryAddress) == sushiHodlStrategyFactoryAddress,
           "sushiHodlStrategyFactoryAddress is invalid");
    log.info("verifying-sushihodl-factory");
    await hre.run("verify:verify", {
        address: sushiHodlStrategyFactoryAddress
    })
});