const { logDeployment, log1 } = require("./utils");
import { task, types } from "hardhat/config";

// npx hardhat compile
// npx hardhat deploy-vault --network polygonmumbai
task("deploy-vault", "Deploys a new Vault contract")
  .setAction(async (args, hre) => {
    log1("---------== deploy-Vault");
    const ctrtName = "Vault";
    const ctrtPath = "Vault";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log1("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, hre.network.name);
    //const addrVault = "0x31c797dE59B3c4D0168d206Cb39287713fae628d";
  });

module.exports;
