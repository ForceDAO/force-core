import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { strict as assert } from 'assert';
import * as sushiHodlStrategyConfig from "../../../../deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat verify-sushihodl-usdc-usdt-strategy  --network polygonmainnet
task("verify-sushihodl-usdc-usdt-strategy", "Verify the sushi-HODL Strategy contract for USDC-USDT underlying on Polygon Scan")
  .setAction(async (args, hre) => {
    
    const { 
        masterChefHodlStrategyAddress
      } = sushiHodlStrategyConfig.default;

    assert(masterChefHodlStrategyAddress != "", "masterChefHodlStrategyAddress is invalid");

    log.info("---------== verify-sushihodl-usdc-usdt-strategy");

    await hre.run("verify:verify", {
        address: masterChefHodlStrategyAddress
    })
});