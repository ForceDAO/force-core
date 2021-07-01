import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork }  from "../../../deploy/config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, Vault, VaultInit }  from "../../../deploy/config/deploy-config-vaults";

task("vault-deposit", "Deposit to a Vault")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

  assert(globalConfigNetwork === vaultConfigNetwork, "network mismatch");

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultProxyAddress = vault.vaultAddress;
  const vaultInit : VaultInit = vault.vaultInit;
  const underlyingAddress = vaultInit.underlying;

  assert(vaultInit.underlying != "", "vaultInit argument: underlying is invalid");

  //load Vault Instance
  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultProxyAddress
  );

  //Approve Vault for Spending of SLP tokens




  //deposit LP Tokens to Vault


  //do HardWork

});