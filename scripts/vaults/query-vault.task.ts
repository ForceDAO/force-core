import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { vaults, Vault, VaultInit }  from "../deploy/config/deploy-config-vaults";
import { deployerAddress }  from "../deploy/config/deploy-config-global";

task("query-vault", "Query a Vault Proxy contract")
  .addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultProxyAddress = vault.vaultAddress;
  const vaultInit : VaultInit = vault.vaultInit;
  const underlyingAddress = vaultInit.underlying;

  const vaultInstance = await hre.ethers.getContractAt(
    "Vault",
    vaultProxyAddress
  );

  const strategyAddress = await vaultInstance.strategy();
  log.info(`strategyAddress for Proxy: ${vaultProxyAddress} is: ${strategyAddress}`);

  const totalSupplyCap = await vaultInstance.totalSupplyCap();
  log.info(`totalSupplyCap for Vault: ${vaultProxyAddress} - ${underlyingname} is: ${totalSupplyCap} `);

  //get Spending-Allowance of SLP tokens for Vault 
  var erc20Instance = await hre.ethers.getContractAt("ERC20", underlyingAddress); 
  const allowance = await erc20Instance.allowance(deployerAddress, vaultProxyAddress);

  const strategyInstance = await hre.ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
  const claimAllowed = await strategyInstance.claimAllowed();
  log.info(`Strategy is initialised with claimAllowed: ${claimAllowed}`);

  log.info(`spending allowance for Spender: ${vaultProxyAddress} on Underlying: ${underlyingAddress} is: ${allowance} `);
});