import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork, deployerAddress }  from "../../deploy/config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, Vault, VaultInit }  from "../../deploy/config/deploy-config-vaults";

task("withdraw", "Withdraw All from Vault")
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

  const signers = await hre.ethers.getSigners();
  const depositor = signers[0];

  const shares = await vaultInstance.balanceOf(depositor.address);

  console.log(`Withdrawing : ${shares} of depositor: ${depositor.address} from Vault: ${vaultProxyAddress} of Underlying: ${underlyingname}`);
  const withdrawTxn = await vaultInstance.connect(depositor).withdraw(shares);
  await withdrawTxn.wait();

  console.log(`withdrawTxn is: ${withdrawTxn}`);
});