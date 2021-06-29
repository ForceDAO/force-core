import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();

task("deploy-sushihodl-factory", "Deploys a new SushiHodl-Factory contract")
  .setAction(async (args, hre) => {
    log.info(`deploying deploy-sushiHodl-factory`);
    const sushiHodlStrategyFactory = await hre.ethers.getContractFactory(`contracts/strategies/sushiHODL/SushiHodlStrategyFactory.sol:SushiHodlStrategyFactory`);
    const instSushiHodlStrategyFactory = await sushiHodlStrategyFactory.deploy();
    const addrSushiHodlStrategyFactory = instSushiHodlStrategyFactory.address;
    log.info(`SushiHodlStrategyFactory: ${addrSushiHodlStrategyFactory} is deployed on network: ${hre.network.name}`);
  });