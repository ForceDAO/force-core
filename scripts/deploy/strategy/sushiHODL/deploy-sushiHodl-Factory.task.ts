import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";

const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-sushiHodl-factory", "Deploys a new SushiHodl-Factory contract")
  .setAction(async (args, hre) => {
    
    log.info("---------== deploy-sushiHodl-factory");
    const sushiHodlStrategyFactory = await hre.ethers.getContractFactory(`contracts/strategies/sushiHODL/SushiHodlStrategyFactory.sol:SushiHodlStrategyFactory`);
    const instSushiHodlStrategyFactory = await sushiHodlStrategyFactory.deploy();
    logDeployment(instSushiHodlStrategyFactory, hre.network.name);
    const addrSushiHodlStrategyFactory = instSushiHodlStrategyFactory.address;
    log.info("SushiHodlStrategyFactory is deployed on network: "+hre.network.name+" - @ address: "+addrSushiHodlStrategyFactory);
  });

module.exports;
