import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork, deployerAddress }  from "../../deploy/config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, Vault, VaultInit }  from "../../deploy/config/deploy-config-vaults";

task("do-hardwork", "Deposit to a Vault")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

  assert(globalConfigNetwork === vaultConfigNetwork, "network mismatch");

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultProxyAddress = vault.vaultAddress;
  const vaultInit : VaultInit = vault.vaultInit;

  assert(vaultInit.underlying != "", "vaultInit argument: underlying is invalid");

  //load Vault Instance
  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultProxyAddress
  );

  //do HardWork
  const hardWorkTxResponse = await vaultInstance.doHardWork();
  await hardWorkTxResponse.wait();
  log.info(`hardWorkTxResponse for deposit is: ${JSON.stringify(hardWorkTxResponse)}`);
});