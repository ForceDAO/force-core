import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "../deploy/config/deploy-config-vaults";
import { network as strategyConfigNetwork, strategies, StrategyData, Strategy } from "../deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config";

task("announce-strategy", "announce the Strategy for the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
.addParam("strategyname","name of the strategy, for Example: SUSHIHODL-USDC-USDT-V1")  
  .setAction(async (args, hre) => {

    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    assert(ethers.utils.getAddress(vaultAddress) == vaultAddress, "Invalid vaultAddress");

    const strategy : Strategy = strategies[args.strategyname];
    const strategyAddress : string = strategy.masterChefHodlStrategyAddress;
    assert(ethers.utils.getAddress(strategyAddress) == strategyAddress, "Invalid strategyAddress");
    assert(strategy.pairName == underlyingname, "Incorrect Strategy for the underlying");

    //Initialise Vault
    log.info(`---------== About to announce Strategy: ${strategyAddress} for Vault: ${vaultAddress}`);
    const vaultInstance = await hre.ethers.getContractAt(
      "Vault",
      vaultAddress
    );

    await vaultInstance.announceStrategyUpdate(
      strategyAddress
    );
});