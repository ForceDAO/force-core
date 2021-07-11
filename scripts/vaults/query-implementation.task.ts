import { task } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";
import { getImplementationAddressOfProxy } from "../helper/transaction-event-log-query";

task("query-implementation", "set the totalSupplyCap to the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {
    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    console.log(`querying implementation for proxyAddress: ${vaultAddress}`);
    const vaultImplementationAddress = await getImplementationAddressOfProxy(hre.ethers.provider, vaultAddress);
    log.info(`VaultProxy: ${vaultAddress} has implementationAddress: ${vaultImplementationAddress}`);
});