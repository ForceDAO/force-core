import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork, deployerAddress }  from "../../deploy/config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, Vault, VaultInit }  from "../../deploy/config/deploy-config-vaults";

task("vault-deposit", "Deposit to a Vault")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .addParam("depositamount", "LP token Amount for VaultDeposit")
  .setAction(async (args, hre) => {

  const depositAmount : number = args.depositamount;
  assert(depositAmount > 0, "Invalid Deposit Amount");

  assert(globalConfigNetwork === vaultConfigNetwork, "network mismatch");

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultProxyAddress = vault.vaultAddress;
  const vaultInit : VaultInit = vault.vaultInit;
  const underlyingAddress = vaultInit.underlying;

  assert(vaultInit.underlying != "", "vaultInit argument: underlying is invalid");

  //Approve Vault for Spending of SLP tokens
  var erc20Instance = await hre.ethers.getContractAt("ERC20", underlyingAddress);
  const approveTxn = await erc20Instance.approve(vaultProxyAddress, depositAmount, {from: deployerAddress});
  await approveTxn.wait();

  //load Vault Instance
  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultProxyAddress
  );

  //deposit LP Tokens to Vault
  const txResponse = await vaultInstance.deposit(depositAmount);
  await txResponse.wait();
  log.info(`txResponse for deposit is: ${JSON.stringify(txResponse)}`);

  //do HardWork
  const hardWorkTxResponse = await vaultInstance.doHardWork();
  await hardWorkTxResponse.wait();
  log.info(`hardWorkTxResponse for deposit is: ${JSON.stringify(hardWorkTxResponse)}`);
});