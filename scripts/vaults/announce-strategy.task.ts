import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import * as deployConfig from "./config/deploy-config";
import { strict as assert } from 'assert';

task("announce-strategy", "announce the Strategy for the Vault")
  .setAction(async (args, hre) => {
  const { 
    vaultAddress
  } = deployConfig.default;

  assert(vaultAddress != "", "vaultInit argument: vaultAddress is invalid");
  assert(vaultInit.underlying != "", "vaultInit argument: underlying is invalid");
  assert(vaultInit.toInvestNumerator > 0, "vaultInit argument: toInvestNumerator is invalid");
  assert(vaultInit.toInvestDenominator > 0, "vaultInit argument: toInvestDenominator is invalid");
  assert(vaultInit.totalSupplyCap > 0, "vaultInit argument: totalSupplyCap is invalid");

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
});