import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { strategies, Strategy } from "../deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config";

task("set-liquidation", "set the Strategy to the Vault")
.addParam("strategyname","name of the strategy, for Example: SUSHIHODL-USDC-USDT-V1")  
  .setAction(async (args, hre) => {
    const strategyName : string = args.strategyname;
    const strategy : Strategy = strategies[strategyName];
    const strategyAddress : string = strategy.masterChefHodlStrategyAddress;
    assert(ethers.utils.getAddress(strategyAddress) == ethers.utils.getAddress(strategyAddress), "Invalid strategyAddress");

    log.info(`About to set Liquidation Parameters to: ${strategyAddress} - StrategyName: ${strategyName} `);
    
    const strategyInstance = await hre.ethers.getContractAt(
      "MasterChefHodlStrategy",
      strategyAddress
    );

    const setLiquidationParamsTxn = await strategyInstance.setLiquidation(true, true, true);
    await setLiquidationParamsTxn.wait();

    log.info(`set liquidationParameters with sellSushi: true, sellWMatic: true & claimAllowed: true completed for strategyAddress: ${strategyAddress}`);
});