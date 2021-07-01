import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "../deploy/config/deploy-config-vaults";
import { network as strategyConfigNetwork, strategies, StrategyData, Strategy } from "../deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config";

task("set-totalsupplycap", "set the totalSupplyCap to the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
.addParam("strategyname","name of the strategy, for Example: SUSHIHODL-USDC-USDT-V1")  
.addParam("totalsupplycap","totalsupplycap for the Vault with Underlying and strategy, for Example: 10000")  
  .setAction(async (args, hre) => {

    const totalsupplycap : number = args.totalsupplycap;
    assert(totalsupplycap > 0, "Incorrect totalsupplycap for the underlying");

    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    assert(ethers.utils.getAddress(vaultAddress) == ethers.utils.getAddress(vaultAddress), "Invalid vaultAddress");
    log.info(`vaultAddress : ${vaultAddress} for underlying: ${underlyingname}`);

    const strategy : Strategy = strategies[args.strategyname];
    const strategyAddress : string = strategy.masterChefHodlStrategyAddress;
    log.info(`strategyAddress : ${strategyAddress} for underlying: ${underlyingname}`);
    assert(ethers.utils.getAddress(strategyAddress) == ethers.utils.getAddress(strategyAddress), "Invalid strategyAddress");
    assert(strategy.pairName == underlyingname, "Incorrect Strategy for the underlying");

    log.info(`updating totalsupplycap: ${totalsupplycap} for Vault: ${vaultAddress}`);
    const vaultInstance = await hre.ethers.getContractAt(
      "Vault",
      vaultAddress
    );

    const totalSupplyCapTxnResponse = await vaultInstance.setTotalSupplyCap(
      totalsupplycap
    );

    log.info(`transactionResponse for setTotalSupplyCap with: ${totalsupplycap} for Vault: ${vaultAddress} is: ${JSON.stringify(totalSupplyCapTxnResponse)}`);
});