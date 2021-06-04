import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
require("dotenv").config();
import * as deployConfig from "./deploy-config";

// npx hardhat compile
// npx hardhat deploy-noMintRewardPool --network polygonmumbai
// lpToken is vaultProxy to Vault
task("deploy-noMintRewardPool", "Deploys a new NoMintRewardPool contract")
  .setAction(async (args, hre) => {
    log.info("---------== check args");
    const rwToken = process.env.RWTOKEN || "";
    const lpToken = process.env.LPTOKEN || "";
    const rewardPoolDuration = parseInt(process.env.RWPOOLDURATION || "604800");
    const rewardDistribution = process.env.RWDISTRIBUTION || "";
    log.info("args:", args, "\nrwToken:", rwToken, "\nlpToken:", lpToken, "\nrewardPoolDuration:",rewardPoolDuration, "\nrewardDistribution:", rewardDistribution);
    if(rwToken === "" || lpToken === "" || rewardDistribution === "") {
      log.info("rwToken or lpToken or rewardDistribution is invalid");
      return;
    }


    log.info("\n---------== deploy-NoMintRewardPool");
    const sourceVault = "0x0000000000000000000000000000000000000000";
    const migrationStrategy = "0x0000000000000000000000000000000000000000";

    const addrStorage = deployConfig.deployedContracts.storageAddress;
    if(addrStorage === "" ) {
      log.error("deploy-NoMintRewardPool -> storageAddress invalid");
      return;
    }

    const factoryNoMintRewardPool = await hre.ethers.getContractFactory(`contracts/RewardPool.sol:NoMintRewardPool`);
    const instNoMintRewardPool = await factoryNoMintRewardPool.deploy(
      rwToken,
      lpToken,
      rewardPoolDuration,
      rewardDistribution,
      addrStorage,
      sourceVault,
      migrationStrategy
    );
    logDeployment(instNoMintRewardPool, hre.network.name);
  });

module.exports;
