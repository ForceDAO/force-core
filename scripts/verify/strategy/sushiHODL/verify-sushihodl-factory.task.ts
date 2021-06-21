import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { strict as assert } from 'assert';
import * as sushiHodlStrategyConfig from "../../../deploy/strategy/sushiHODL/config/deploy-sushiHodl-config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat verify-sushihodl-factory --network polygonmainnet
task("verify-sushihodl-factory", "Verify the sushi-HODL Strategy's Factory contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
    const { 
        sushiHodlStrategyFactoryAddress
      } = sushiHodlStrategyConfig.default;

    assert(sushiHodlStrategyFactoryAddress != "", "sushiHodlStrategyFactoryAddress is invalid");

    log.info("---------== verify-sushihodl-factory");

    await hre.run("verify:verify", {
        address: sushiHodlStrategyFactoryAddress
    })
});