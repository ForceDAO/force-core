const { logDeployment, toWei, fromWei, log1 } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-controller --network polygonmumbai
task("deploy-controller", "Deploys a new Controller contract")
  .setAction(async (args, hre) => {
    log1("---------== part1: deploy-Storage");
    let ctrtName, ctrtPath;
    ctrtName = "Storage"
    ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);

    log1("---------== deploy-FeeRewardForwarder");
    const owner = process.env.OWNER;
    log1("args:", args, ", owner:", owner);
    ctrtName = "FeeRewardForwarder";
    ctrtPath = "FeeRewardForwarder";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryFeeRwForwarder = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instFeeRwForwarder= await factoryFeeRwForwarder.deploy();
    //const instFeeRwForwarder = await factoryFeeRwForwarder.deploy(args.storage, owner, args.forceProfitSharing);
    logDeployment(instFeeRwForwarder, hre.network.name);

    log1("---------== deploy-Controller");
    const treasury = process.env.TREASURY || "";
    log1("args:", args, "\ntreasury:",treasury );
    ctrtName = "Controller";
    ctrtPath = "Controller";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);
    const factoryController = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instController = await factoryController.deploy(
      instStorage.address,
      instFeeRwForwarder.address,
      treasury
    );
    logDeployment(instController, hre.network.name);

    await instStorage.setController(instController.address);
  });

module.exports;
