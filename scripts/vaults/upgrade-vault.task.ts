import { task } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";
import { getVaultImplementationFromTransactionHash } from "../helper/transaction-event-log-query";

task("upgrade-vault", "set the totalSupplyCap to the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    const vaultImplementationAddress : string = vault.vaultImplementationAddress;
    assert(hre.ethers.utils.getAddress(vaultAddress) == hre.ethers.utils.getAddress(vaultAddress), "Invalid vaultAddress");
    assert(hre.ethers.utils.getAddress(vaultImplementationAddress) == hre.ethers.utils.getAddress(vaultImplementationAddress), "Invalid vaultAddress");
    log.info(`vaultAddress : ${vaultAddress} with implementation: ${vaultImplementationAddress} for underlying: ${underlyingname}`);

    log.info(`upgrading VaultProxy At : ${vaultAddress} with new implementation of Vault`);

    const vaultContract = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);
    const vaultUpgradeTxnResponse = await hre.upgrades.upgradeProxy(vaultAddress, vaultContract);

    await vaultUpgradeTxnResponse.wait();

    log.info(`transactionResponse for  VaultProxy: ${vaultAddress} is: ${JSON.stringify(vaultUpgradeTxnResponse)}`);
    assert(vaultUpgradeTxnResponse.status == 0, "vaultUpgradeFailed");

    const vaultInstance = await hre.ethers.getContractAt(
        "Vault",
        vaultAddress
    );

    const newVaultImplementationAddress = await getVaultImplementationFromTransactionHash(vaultUpgradeTxnResponse.hash, hre);

    if(vaultImplementationAddress == newVaultImplementationAddress){
        log.error(`Vault Upgrade has Errors as the newImplementationAddress is same as existing ImplementationAddress`);
    }else{
        log.info(`Vault is upgraded to new implementationAddress: ${newVaultImplementationAddress}`);
    }
});