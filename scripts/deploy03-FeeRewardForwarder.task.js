const {
  logDeployment,
  toWei,
  fromWei,
  log1,
} = require("./utils");

// npx hardhat compile
// npx hardhat deploy-FeeRewardForwarder --network polygonmumbai --storage 0x... --forceProfitSharing 0x..
task("deploy-FeeRewardForwarder", "Deploys a new FeeRewardForwarder contract")
  .setAction(async (args, hre) => {
    log1("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);

    log1("---------== part2: deploy-ForceProfitSharing");
    ctrtName = "ForceProfitSharing";
    ctrtPath = "ForceProfitSharing";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryForceProfitSharing = await hre.ethers.getContractFactory(
      `${ctrtName}`
    );//contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instForceProfitSharing = await factoryForceProfitSharing.deploy(owner);
    logDeployment(instForceProfitSharing, hre.network.name);

    log1("---------== deploy-FeeRewardForwarder");
    const owner = process.env.OWNER || "";
    log1("args:", args, ", owner:", owner);
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instCtrt = await factoryFeeRwForwarder.deploy(instStorage.address, owner, instForceProfitSharing);
    logDeployment(instCtrt, hre.network.name);
  });

module.exports;
