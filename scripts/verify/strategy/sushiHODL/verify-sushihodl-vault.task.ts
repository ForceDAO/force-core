import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { Logger } from "tslog";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { network as vaultConfigNetwork, vaults, VaultData, Vault, VaultInit }  from "../../../deploy/config/deploy-config-vaults";

task("verify-sushihodl-vault", "Verify the sushi-HODL Strategy's Vault contract for an underlying on Polygon Scan")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")  
.setAction(async (args, hre) => {
  const underlyingname : string = args.underlyingname;
  const vault : Vault = vaults[underlyingname];
  const vaultAddress : string = vault.vaultAddress;
  assert(ethers.utils.getAddress(vaultAddress) == vaultAddress, "Cannot validate Invalid vaultAddress");

  log.info("---------== verify-sushihodl-vault");

  await hre.run("verify:verify", {
    address: vaultAddress
  })
});