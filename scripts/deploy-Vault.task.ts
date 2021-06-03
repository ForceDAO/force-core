import { logDeployment } from "./deploymentLogUtils";
import { task, types } from "hardhat/config";
import { Logger } from "tslog";
const log: Logger = new Logger();
require("dotenv").config();
const addrStorage = process.env.STORAGE_CONTRACT_ADDRESS

// npx hardhat compile
// npx hardhat deploy-vault --network polygonmumbai
task("deploy-vault", "Deploys a new Vault contract")
  .setAction(async (args, hre) => {
    log.info("---------== deploy-Vault");
    const factoryCtrt = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);
    const vaultContractInstance = await factoryCtrt.deploy();
    logDeployment(vaultContractInstance, hre.network.name);
    //TODO set Deployed Vault Address in .env as: VAULT_ADDRESS
    log.info(`--------- Must Do Activity: ${vaultContractInstance.address} gets in to .env as: VAULT_ADDRESS --------- `);

    //const addrVault = "0x31c797dE59B3c4D0168d206Cb39287713fae628d";
  });

module.exports;
