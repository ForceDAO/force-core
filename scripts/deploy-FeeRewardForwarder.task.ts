import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();
require("dotenv").config();

// npx hardhat compile
// npx hardhat deploy-feeRewardForwarder --network polygonmumbai
// --storage 0x... --farmRwToken 0x..
task("deploy-feeRewardForwarder", "Deploys a new FeeRewardForwarder contract")
  .setAction(async (args, hre) => {
    log.info("---------== check args");
    const owner = process.env.OWNER || "";
    log.info("args:", args, ", owner:", owner);
    if(owner === "") {
      log.info("owner invalid");
      return;
    }
    const addrFarmRwToken = process.env.FARM_REWARD_TOKEN_ADDRESS
    const addrStorage = process.env.STORAGE_CONTRACT_ADDRESS

    log.info("---------== deploy-FeeRewardForwarder");
    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`contracts/FeeRewardForwarder.sol:FeeRewardForwarder`);
    const instFeeRewardForwarder = await factoryFeeRwForwarder.deploy(addrStorage, owner, addrFarmRwToken);
    logDeployment(instFeeRewardForwarder, hre.network.name);

    //gets instFeeRewardForwarder.address in to FEE_REWARD_FORWARDER_ADDRESS
    log.info(`--------- Must Do Activity: ${instFeeRewardForwarder.address} gets in to .env as: FEE_REWARD_FORWARDER_ADDRESS --------- `);
  });

module.exports;
