const { logDeployment, toWei, fromWei, log1, } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-Storage --network polygonmumbai
task("deploy-Storage", "Deploys a new Storage contract")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-Storage");
    const ctrtName = "Storage"
    const ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, hre.network.name);
  }
);

module.exports;
