import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { network as globalConfigNetwork, storageAddress }  from "../../config/deploy-config-global";
import { network as strategyConfigNetwork, strategies, StrategyData, Strategy } from "./config/deploy-sushiHodl-polygon-mainnet-config";
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "../../config/deploy-config-vaults";

import { Logger } from "tslog";
import { strict as assert } from 'assert';
const log: Logger = new Logger();

task("deploy-sushihodl-strategy", "Creates a new sushi-HODL Strategy using sushiHODLFactory Contract")
  .addParam("strategyname","name of the strategy, for Example: SUSHIHODL-USDC-USDT-V1")
  .setAction(async (args, hre) => {

  assert(globalConfigNetwork === strategyConfigNetwork, "network mismatch");
  assert(globalConfigNetwork === vaultConfigNetwork, "network mismatch");

  const strategyInit : Strategy = strategies[args.strategyname];

  const underlyingname : string = strategyInit.pairName;
  const vault : Vault = vaults[underlyingname];
  const vaultAddress : string = vault.vaultAddress;
  const underlying : string = vault.vaultInit.underlying;

  const { 
    sushiHodlStrategyFactoryAddress,
    miniChefV2,
    poolId,
    routerAddressV2,
    sushiTokenAddress,
    wmaticTokenAddress,
    routeSushiToken0,
    routeSushiToken1,
    routeWmaticToken0,
    routeWmaticToken1
  } = strategyInit;

  assert(sushiHodlStrategyFactoryAddress != "", "sushiHodlStrategyFactoryAddress is invalid");
  assert(underlying != "", "underlying is invalid");
  assert(miniChefV2 != "", "miniChefV2 is invalid");
  assert(poolId >= 0, "poolId is invalid");
  assert(routerAddressV2 != "", "routerAddressV2 is invalid");
  assert(sushiTokenAddress != "", "sushiTokenAddress is invalid");
  assert(wmaticTokenAddress != "", "wmaticTokenAddress is invalid");
  assert(routeSushiToken0.length === 2 && routeSushiToken0[0] != "" && routeSushiToken0[1] != "" , "routeSushiToken0 is invalid");
  assert(routeSushiToken1.length === 2 && routeSushiToken1[0] != "" && routeSushiToken1[1] != "" , "routeSushiToken1 is invalid");
  assert(routeWmaticToken0.length === 2 && routeWmaticToken0[0] != "" && routeWmaticToken0[1] != "" , "routeWmaticToken0 is invalid");
  assert(routeWmaticToken1.length === 2 && routeWmaticToken1[0] != "" && routeWmaticToken1[1] != "" , "routeWmaticToken1 is invalid");

  log.info(`creating sushiHODLStrategy for : ${args.strategyname} and underlying: ${underlyingname}`);

  //create sushiHODLStrategyFactory Contract Instance using sushiHodlStrategyFactory Contract Address & ABI
  const sushiHodlStrategyFactoryInstance = await hre.ethers.getContractAt(
    "SushiHodlStrategyFactory",
    sushiHodlStrategyFactoryAddress
  );

  const sushiHodlStrategyCreationTransactionResponse = await sushiHodlStrategyFactoryInstance.createSushiHodlStrategy(
    storageAddress,
    underlying,
    vaultAddress,
    miniChefV2,
    poolId,
    routerAddressV2,
    sushiTokenAddress,
    wmaticTokenAddress,
    routeSushiToken0,
    routeSushiToken1,
    routeWmaticToken0,
    routeWmaticToken1
  );

  await sushiHodlStrategyCreationTransactionResponse.wait();

  log.info(`Created and Initialised SushiHodlStrategy for underlying: ${underlyingname} and Vault: ${vaultAddress} on network: ${hre.network.name} with arguments: \n`);
  log.info(`sushiHodlStrategyFactoryAddress: ${sushiHodlStrategyFactoryAddress}`);
  log.info(`underlying: ${underlying}`); 
  log.info(`miniChefV2: ${miniChefV2}`);
  log.info(`poolId: ${poolId}`);
  log.info(`routerAddressV2: ${routerAddressV2}`);
  log.info(`sushiTokenAddress: ${sushiTokenAddress}`);
  log.info(`wmaticTokenAddress: ${wmaticTokenAddress}`);
  log.info(`routeSushiToken0: ${routeSushiToken0}`);
  log.info(`routeSushiToken1: ${routeSushiToken1}`);
  log.info(`routeWmaticToken0: ${routeWmaticToken0}`);
  log.info(`routeWmaticToken1: ${routeWmaticToken1}`);
});