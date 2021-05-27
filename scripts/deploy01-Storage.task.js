const { logDeployment, log1, } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-storage --network polygonmumbai
task("deploy-storage", "Deploys a new Storage contract")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-Storage");
    const ctrtName = "Storage"
    const ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryStorage = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instStorage = await factoryStorage.deploy();
    logDeployment(instStorage, hre.network.name);
  }
);

module.exports;
