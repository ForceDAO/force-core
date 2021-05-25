const { logDeployment, toWei, fromWei, log1 } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-NoMintRewardPool --network polygonmumbai
task("deploy-NoMintRewardPool", "Deploys a new NoMintRewardPool contract")
  .setAction(async (args, hre) => {
    log1("---------== deploy-NoMintRewardPool ... deploy-Storage");
    const ctrtName = "Storage"
    const ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instStorage = await factoryCtrt.deploy();
    logDeployment(instStorage, hre.network.name);

    log1("\n---------== deploy-NoMintRewardPool");
    const rwToken = process.env.rwToken;
    const lpToken = process.env.lpToken;
    const rewardPoolDuration = process.env.rewardPoolDuration || "604800";
    const rewardPoolDuration = parseInt(rewardPoolDuration);
    const rewardDistribution = process.env.RWDISTRIBUTION;
    log1("args:", args, "\nrwToken:", rwToken, "\nlpToken:", lpToken, "\nrewardPoolDuration:",rewardPoolDuration, "\nrewardDistribution:", rewardDistribution, "\nStorage:", instStorage.address);
    const sourceVault = "0x0000000000000000000000000000000000000000";
    const migrationStrategy = "0x0000000000000000000000000000000000000000";

    const ctrtName = "NoMintRewardPool";
    const ctrtPath = "NoMintRewardPool";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instCtrt = await factoryCtrt.deploy(
      rwToken,
      lpToken,
      rewardPoolDuration,
      rewardDistribution,
      instStorage.address,
      sourceVault,
      migrationStrategy
    );
    logDeployment(instCtrt, hre.network.name);
  });

module.exports;
