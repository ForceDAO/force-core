import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as sushiHodlStrategyConfig from "../../../config/deploy-sushiHodl-config";
import { Logger } from "tslog";
const log: Logger = new Logger();


task("verify-sushihodl-factory", "Verify the sushi-HODL Strategy's Factory contract on Polygon Scan")
  .setAction(async (args, hre) => {
    
    const { 
        sushiHodlStrategyFactoryAddress
      } = sushiHodlStrategyConfig.default;

    assert(sushiHodlStrategyFactoryAddress != "", "sushiHodlStrategyFactoryAddress is invalid");

    log.info("---------== verify-sushihodl-storage");

    await hre.run("verify:verify", {
        address: sushiHodlStrategyFactoryAddress
    })
});