import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { strict as assert } from 'assert';
import { Logger } from "tslog";
const log: Logger = new Logger();
import { network as strategyConfigNetwork, strategies, StrategyData, Strategy } from "../../../deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config";
import { ethers } from "ethers";

task("verify-sushihodl-strategy", "Verify the sushi-HODL Strategy contract for a strategy on Polygon Scan")
.addParam("strategyname","name of the strategy, for Example: SUSHIHODL-USDC-USDT-V1")  
.setAction(async (args, hre) => {
    
    const strategy : Strategy = strategies[args.strategyname];
    const strategyAddress : string = strategy.masterChefHodlStrategyAddress;
    assert(ethers.utils.getAddress(strategyAddress) == ethers.utils.getAddress(strategyAddress), "Cannot validate Invalid strategyAddress");

    log.info(`verify-sushihodl-strategy : ${strategyAddress}`);

    await hre.run("verify:verify", {
        address: strategyAddress
    })
});