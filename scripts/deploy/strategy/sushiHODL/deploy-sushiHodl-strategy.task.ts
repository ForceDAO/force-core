import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as deployConfig from "../../config/deploy-config";
import * as sushiHodlStrategyConfig from "./config/deploy-sushiHodl-config";
import { Logger } from "tslog";
import { strict as assert } from 'assert';
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-sushihodl-strategy --network polygonmainnet
task("deploy-sushihodl-strategy", "Creates a new sushi-HODL Strategy using sushiHODLFactory Contract")
  .setAction(async (args, hre) => {
    
  const {
        storageAddress,
        vaultAddress
    } = deployConfig.deployedContracts;

  assert(storageAddress != "", "storageAddress is invalid");
  assert(vaultAddress != "", "vaultAddress is invalid");

  const { 
    sushiHodlStrategyFactoryAddress,
    underlying, 
    miniChefV2,
    poolId,
    routerAddressV2,
    sushiTokenAddress,
    wmaticTokenAddress,
    routeSushiToken0,
    routeSushiToken1,
    routeWmaticToken0,
    routeWmaticToken1
  } = sushiHodlStrategyConfig.default;

  assert(sushiHodlStrategyFactoryAddress != "", "sushiHodlStrategyFactoryAddress is invalid");
  assert(underlying != "", "underlying is invalid");
  assert(miniChefV2 != "", "miniChefV2 is invalid");
  assert(poolId > 0, "poolId is invalid");
  assert(routerAddressV2 != "", "routerAddressV2 is invalid");
  assert(sushiTokenAddress != "", "sushiTokenAddress is invalid");
  assert(wmaticTokenAddress != "", "wmaticTokenAddress is invalid");
  assert(routeSushiToken0.length === 2 && routeSushiToken0[0] != "" && routeSushiToken0[1] != "" , "routeSushiToken0 is invalid");
  assert(routeSushiToken1.length === 2 && routeSushiToken1[0] != "" && routeSushiToken1[1] != "" , "routeSushiToken1 is invalid");
  assert(routeWmaticToken0.length === 2 && routeWmaticToken0[0] != "" && routeWmaticToken0[1] != "" , "routeWmaticToken0 is invalid");
  assert(routeWmaticToken1.length === 2 && routeWmaticToken1[0] != "" && routeWmaticToken1[1] != "" , "routeWmaticToken1 is invalid");

  log.info("---------== create-sushiHODLStrategy");

  //create sushiHODLStrategyFactory Contract Instance using sushiHodlStrategyFactory Contract Address & ABI
  const sushiHodlStrategyFactoryInstance = await hre.ethers.getContractAt(
    "SushiHodlStrategyFactory",
    sushiHodlStrategyFactoryAddress
  );

  const sushiHodlStrategyCreationTransactionReceipt = await sushiHodlStrategyFactoryInstance.createSushiHodlStrategy(
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

  log.info(`Created and Initialised SushiHodlStrategy: ${JSON.stringify(sushiHodlStrategyCreationTransactionReceipt)} on network: ${hre.network.name} with arguments: \n`);
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

  const transactionHash = sushiHodlStrategyCreationTransactionReceipt.
});

module.exports;
