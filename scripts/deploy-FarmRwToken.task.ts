import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";
const log: Logger = new Logger();
require("dotenv").config();

// npx hardhat compile
// npx hardhat deploy-farmRwToken --network polygonmumbai
// farm === IRewardPool(_pool).rewardToken(),
task("deploy-farmRwToken", "Deploys a new FarmRwToken contract")
.setAction(
  async (args, hre) => {
    log.info("---------== deploy-FarmRwToken");
    const addrStorage = process.env.STORAGE_CONTRACT_ADDRESS

    const factoryFarmRwToken = await hre.ethers.getContractFactory(`contracts/RewardToken.sol:RewardToken`);
    const instFarmRwToken = await factoryFarmRwToken.deploy(addrStorage);
    logDeployment(instFarmRwToken, hre.network.name);
    const addrFarmRwToken = instFarmRwToken.address;
    //addrFarmRwToken set this value in .env property:  FARM_REWARD_TOKEN_ADDRESS
    log.info(`--------- Must Do Activity: ${addrFarmRwToken} gets in to .env as: FARM_REWARD_TOKEN_ADDRESS --------- `);

    //const addrFarmRwToken = "0x27CfC18Df50dc0D4e0EBF8CFad66622A08611FC9";

  }
);

module.exports;
