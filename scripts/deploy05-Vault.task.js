const { logDeployment, toWei, fromWei, log1 } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-Vault --network polygonmumbai
task("deploy-Vault", "Deploys a new Vault contract")
  .setAction(async (args, hre) => {
    log1("---------== deploy-Vault");
    const ctrtName = "Vault";
    const ctrtPath = "Vault";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, hre.network.name);
  });

module.exports;
