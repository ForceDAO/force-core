import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();

task("deploy-sushihodl-factory", "Deploys a new SushiHodl-Factory contract")
  .setAction(async (args, hre) => {
    log.info(`deploying deploy-sushiHodl-factory on network: ${hre.network.name}`);
    const sushiHodlStrategyFactory = await hre.ethers.getContractFactory(`contracts/strategies/sushiHODL/SushiHodlStrategyFactory.sol:SushiHodlStrategyFactory`);
    const instSushiHodlStrategyFactory = await sushiHodlStrategyFactory.deploy();
    await instSushiHodlStrategyFactory.deployed();
    const addrSushiHodlStrategyFactoryAddress = instSushiHodlStrategyFactory.address;
    log.info(`copy SushiHodlStrategyFactory: ${addrSushiHodlStrategyFactoryAddress} to constant: sushiHodlStrategyFactoryAddress in deploy-config-global.ts`);
  });