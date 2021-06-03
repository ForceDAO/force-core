import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat compile
// npx hardhat deploy-vault --network polygonmumbai
task("deploy-vault", "Deploys a new Vault contract")
  .setAction(async (args, hre) => {
    log.info("---------== deploy-Vault");
    const ctrtName = "Vault";
    const ctrtPath = "Vault";
    log.info("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/${ctrtPath}.sol:${ctrtName}`);
    log.info("check2");
    const instCtrt = await factoryCtrt.deploy();
    logDeployment(instCtrt, hre.network.name);
    //const addrVault = "0x31c797dE59B3c4D0168d206Cb39287713fae628d";
  });

module.exports;
