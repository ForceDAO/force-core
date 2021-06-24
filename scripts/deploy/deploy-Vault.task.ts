import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork, storageAddress }  from "./config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "./config/deploy-config-vaults";

task("deploy-vault", "Deploys a new Vault contract")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

  assert(globalConfigNetwork === vaultConfigNetwork, "network mismatch");

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultInit : VaultInit = vault.vaultInit;

  assert(vaultInit, "vaultInit is Invalid");
  assert(vaultInit.underlying != "", "vaultInit argument: underlying is invalid");
  assert(vaultInit.toInvestNumerator > 0, "vaultInit argument: toInvestNumerator is invalid");
  assert(vaultInit.toInvestDenominator > 0, "vaultInit argument: toInvestDenominator is invalid");
  assert(vaultInit.totalSupplyCap > 0, "vaultInit argument: totalSupplyCap is invalid");

  log.info(`---------== deploy-Vault on network: ${hre.network.name}`);
  const vaultContract = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);
  const vaultContractInstance = await vaultContract.deploy();
  log.info(`--------- Must Do Activity: ${vaultContractInstance.address} deploy-config.ts as: vaultAddress --------- `);
  const vaultAddress = vaultContractInstance.address;

  //Initialise Vault
  log.info("---------== About to Initialise Vault: "+vaultAddress);
  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultAddress
  );

  await vaultInstance.initializeVault(
    storageAddress,
    vaultInit.underlying,
    vaultInit.toInvestNumerator,
    vaultInit.toInvestDenominator,
    vaultInit.totalSupplyCap
  );

  log.info(`Initialised Vault: ${vaultAddress} on network: ${hre.network.name} with arguments: \n`);
  log.info(`storageAddress: ${storageAddress}`);
  log.info(`underlying: ${vaultInit.underlying}`);
  log.info(`toInvestNumerator: ${vaultInit.toInvestNumerator}`);
  log.info(`toInvestDenominator: ${vaultInit.toInvestDenominator}`);
  log.info(`totalSupplyCap: ${vaultInit.totalSupplyCap}`);
});