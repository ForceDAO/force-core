const {
  logDeployment,
  toWei,
  fromWei,
  log1,
} = require("./utils");

// npx hardhat compile
// npx hardhat deploy-feeRewardForwarder --network polygonmumbai --storage 0x... --farmRwToken 0x..
task("deploy-feeRewardForwarder", "Deploys a new FeeRewardForwarder contract")
  .setAction(async (args, hre) => {
    log1("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);

    log1("---------== part2: deploy-FarmRwToken");
    ctrtName = "FarmRwToken";
    ctrtPath = "FarmRwToken";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFarmRwToken = await hre.ethers.getContractFactory(
      `${ctrtName}`
    );//contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instFarmRwToken = await factoryFarmRwToken.deploy(owner);
    logDeployment(instFarmRwToken, hre.network.name);

    log1("---------== deploy-FeeRewardForwarder");
    const owner = process.env.OWNER || "";
    log1("args:", args, ", owner:", owner);
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instCtrt = await factoryFeeRwForwarder.deploy(instStorage.address, owner, instFarmRwToken);
    logDeployment(instCtrt, hre.network.name);
  });

module.exports;
