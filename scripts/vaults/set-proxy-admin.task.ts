import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";


task("set-proxy-admin", "set the Vault proxy admin")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
.addParam("proxyadmin","New proxy admin address")
  .setAction(async (args, hre) => {

    const underlyingname: string = args.underlyingname;
    const vault: Vault = vaults[underlyingname];
    const vaultAddress: string = vault.vaultAddress;
    assert(ethers.utils.getAddress(vaultAddress) == ethers.utils.getAddress(vaultAddress), "Invalid vaultAddress");
    log.info(`vaultAddress: ${vaultAddress} for underlying: ${underlyingname}`);

    const vaultProxy = await hre.ethers.getContractAt(
      ["function changeAdmin(address newAdmin) external"],
      vaultAddress
    );

    await vaultProxy.changeAdmin(
      args.proxyadmin,
      {
        gasLimit: 1e6
      }
    );

});