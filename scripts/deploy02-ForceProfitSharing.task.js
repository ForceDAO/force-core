const {
  logDeployment,
  toWei,
  fromWei,
  log1,timeForwardInSeconds, 
} = require("./utils");

// npx hardhat compile
// npx hardhat deploy-ForceProfitSharing --network polygonmumbai
task("deploy-ForceProfitSharing", "Deploys a new ForceProfitSharing contract")
.addParam("addr", "addr")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-ForceProfitSharing");
    const owner = process.env.OWNER || "";
    log1("owner:", owner);

    const ctrtName = "ForceProfitSharing";
    const ctrtPath = "ForceProfitSharing";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(
      `${ctrtName}`
    );//contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instCtrt = await factoryCtrt.deploy(owner);
    logDeployment(instCtrt, hre.network.name);
  }
);

module.exports;
