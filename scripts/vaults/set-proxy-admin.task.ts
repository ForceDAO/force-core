import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";


task("transfer-proxy-admin-owner", "set the Vault proxy admin")
.addParam("newowner","New Admin Owner")
.addParam("proxyadmin","Proxy admin address")
  .setAction(async (args, hre) => {


    const proxyAdmin = await hre.ethers.getContractAt(
      ["function transferOwnership(address newOwner)"],
      args.proxyadmin
    );

    await proxyAdmin.transferOwnership(
      args.newowner,
      {
        gasLimit: 1e6
      }
    );

});