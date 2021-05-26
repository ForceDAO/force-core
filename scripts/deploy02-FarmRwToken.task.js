const {
  logDeployment,
  toWei,
  fromWei,
  log1,timeForwardInSeconds, 
} = require("./utils");

// npx hardhat compile
// npx hardhat deploy-farmRwToken --network polygonmumbai
// farm === IRewardPool(_pool).rewardToken(),
task("deploy-farmRwToken", "Deploys a new FarmRwToken contract")
.addParam("addr", "addr")
.setAction(
  async (args, hre) => {
    log1("---------== deploy-FarmRwToken");
    const owner = process.env.OWNER || "";
    log1("owner:", owner);

    const ctrtName = "FarmRwToken";
    const ctrtPath = "FarmRwToken";
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
