const { logDeployment, toWei, fromWei, timeForwardInSeconds, log1, addr0 } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-storage --network polygonmumbai
task("deploy-storage", "Deploys a new contract")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-storage");
    const ctrtName = "Storage"
    const ctrtPath = "Storage"
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, network);
  }
);
// task("deploy-storage", "deploy-storage", async (args, hre) => {
//   //const [user0] = await hre.ethers.getSigners();

//   const ctrtName = "Storage";
//   const ctrtPath = "Storage";//.sol omitted
//   const factoryCtrt = await hre.ethers.getContractFactory(`/contracts/${ctrtPath}.sol:${ctrtName}`);
//   const instCtrt = await factoryCtrt.deploy();
//   await instCtrt.deployed();
//   logDeployment(instCtrt, network);
// });
module.exports;
