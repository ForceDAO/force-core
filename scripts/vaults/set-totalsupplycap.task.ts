import { task } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";

task("set-totalsupplycap", "set the totalSupplyCap to the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
.addParam("totalsupplycap","totalsupplycap for the Vault with Underlying and strategy, for Example: 10000")  
  .setAction(async (args, hre) => {

    const totalsupplycap : number = args.totalsupplycap;
    assert(totalsupplycap > 0, "Incorrect totalsupplycap for the underlying");

    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    assert(ethers.utils.getAddress(vaultAddress) == ethers.utils.getAddress(vaultAddress), "Invalid vaultAddress");
    log.info(`vaultAddress : ${vaultAddress} for underlying: ${underlyingname}`);

    log.info(`updating totalsupplycap: ${totalsupplycap} for Vault: ${vaultAddress}`);

    const vaultInstance = await hre.ethers.getContractAt(
      "Vault",
      vaultAddress
    );

    const totalSupplyCapTxnResponse = await vaultInstance.setTotalSupplyCap(
      totalsupplycap
    );

    await totalSupplyCapTxnResponse.wait();

    log.info(`transactionResponse for setTotalSupplyCap with: ${totalsupplycap} for Vault: ${vaultAddress} is: ${JSON.stringify(totalSupplyCapTxnResponse)}`);
});