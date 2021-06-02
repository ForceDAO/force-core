import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();

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

    log.info("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
    const addrStorage = instStorage.address;
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";
    
    log.info("\n---------== deploy-NoMintRewardPool");
    const sourceVault = "0x0000000000000000000000000000000000000000";
    const migrationStrategy = "0x0000000000000000000000000000000000000000";

    ctrtName = "NoMintRewardPool";
    ctrtPath = "RewardPool";
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryNoMintRewardPool = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check2");
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
