const {
  logDeployment,  log1,
} = require("./utils");

// npx hardhat compile
// npx hardhat deploy-feeRewardForwarder --network polygonmumbai
// --storage 0x... --farmRwToken 0x..
task("deploy-feeRewardForwarder", "Deploys a new FeeRewardForwarder contract")
  .setAction(async (args, hre) => {
    log1("---------== check args");
    const owner = process.env.OWNER || "";
    log1("args:", args, ", owner:", owner);
    if(owner === "") {
      log1("owner invalid");
      return;
    }
    log1("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
    const addrStorage = instStorage.address;
    //const addrStorage = "0x0BF9041BAA9320b47E00B97725569eC1ddD7DdB2";

    log1("---------== part2: deploy-FarmRwToken");
    ctrtName = "RewardToken";
    ctrtPath = "RewardToken";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFarmRwToken = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instFarmRwToken = await factoryFarmRwToken.deploy(addrStorage);
    logDeployment(instFarmRwToken, hre.network.name);
    const addrFarmRwToken = instFarmRwToken.address;
    
    log1("---------== deploy-FeeRewardForwarder");
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instFeeRewardForwarder = await factoryFeeRwForwarder.deploy(addrStorage, owner, addrFarmRwToken);
    logDeployment(instFeeRewardForwarder, hre.network.name);
  });

module.exports;
