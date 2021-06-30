import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';

task("query-vault", "Query a Vault Proxy contract")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultProxyAddress = vault.vaultAddress;

  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultProxyAddress
  );

  const strategyAddress = await vaultInstance.strategy();
  
  log.info(`strategyAddress for Proxy: ${vaultProxyAddress} is: ${strategyAddress}`);
});