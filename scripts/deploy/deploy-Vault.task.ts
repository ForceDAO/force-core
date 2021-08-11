import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { network as globalConfigNetwork, storageAddress }  from "./config/deploy-config-global";
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "./config/deploy-config-vaults";
import { getImplementationAddressOfProxy } from "../helper/transaction-event-log-query";
import { ethers } from "ethers";

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
  assert(ethers.BigNumber.from(vaultInit.totalSupplyCap).gt(0), "vaultInit argument: totalSupplyCap is invalid");

  log.info(`deploying Vault on network: ${hre.network.name}`);
  const vaultContract = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);

  const vaultProxyContractInstance = await hre.upgrades.deployProxy(vaultContract, 
      [
        storageAddress,
        vaultInit.underlying,
        vaultInit.toInvestNumerator,
        vaultInit.toInvestDenominator,
        vaultInit.totalSupplyCap
      ],
      {
         initializer: 'initializeVault(address,address,uint256,uint256,uint256)', 
         unsafeAllow: ['constructor'],
         unsafeAllowCustomTypes: true
      });

  await vaultProxyContractInstance.deployed();

  const vaultProxyAddress = vaultProxyContractInstance.address;

  log.info(`copy ${vaultProxyAddress} to deploy-config-vaults.ts as: vaultAddress`);

  const vaultImplementationAddress = 
  await getImplementationAddressOfProxy(hre.ethers.provider, vaultProxyAddress);

  log.info(`copy ${vaultImplementationAddress} to deploy-config-vaults.ts as: vaultImplementationAddress`);

  log.info(`Initialised Vault: ${vaultProxyContractInstance.address} on network: ${hre.network.name} with arguments: \n`);
  log.info(`storageAddress: ${storageAddress}`);
  log.info(`underlying: ${vaultInit.underlying}`);
  log.info(`toInvestNumerator: ${vaultInit.toInvestNumerator}`);
  log.info(`toInvestDenominator: ${vaultInit.toInvestDenominator}`);
  log.info(`totalSupplyCap: ${vaultInit.totalSupplyCap}`);
});