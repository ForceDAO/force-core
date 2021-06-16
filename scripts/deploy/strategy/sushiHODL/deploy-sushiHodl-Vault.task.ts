import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
require("dotenv").config();

// npx hardhat compile
// npx hardhat deploy-vault --network polygonmumbai
task("deploy-sushiHODL-vault", "Deploys a new Vault contract for sushiHODLVault")
  .setAction(async (args, hre) => {
    log.info("---------== deploy-sushiHODL-Vault");
    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);
    const vaultContractInstance = await factoryCtrt.deploy();
    logDeployment(vaultContractInstance, hre.network.name);
    //TODO set Deployed Vault Address in .env as: VAULT_ADDRESS
    log.info(`--------- Must Do Activity: ${vaultContractInstance.address} gets in to .env as: VAULT_ADDRESS --------- `);

    //const addrVault = "0x31c797dE59B3c4D0168d206Cb39287713fae628d";
  });

module.exports;
