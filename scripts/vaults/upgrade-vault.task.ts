import { task } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import { strict as assert } from 'assert';
import { ethers, network } from "hardhat";
import { vaults, Vault }  from "../deploy/config/deploy-config-vaults";
import { logger } from "ethers";

task("upgrade-vault", "set the totalSupplyCap to the Vault")
.addParam("underlyingname","name of the underlying, for Example: USDC-USDT")
  .setAction(async (args, hre) => {

    const underlyingname : string = args.underlyingname;
    const vault : Vault = vaults[underlyingname];
    const vaultAddress : string = vault.vaultAddress;
    const vaultImplementationAddress : string = vault.vaultImplementationAddress;
    assert(ethers.utils.getAddress(vaultAddress) == ethers.utils.getAddress(vaultAddress), "Invalid vaultAddress");
    assert(ethers.utils.getAddress(vaultImplementationAddress) == ethers.utils.getAddress(vaultImplementationAddress), "Invalid vaultAddress");
    log.info(`vaultAddress : ${vaultAddress} with implementation: ${vaultImplementationAddress} for underlying: ${underlyingname}`);

    log.info(`upgrading VaultProxy At : ${vaultAddress} with new implementation of Vault`);

    const vaultContract = await hre.ethers.getContractFactory(`contracts/Vault.sol:Vault`);
    const vaultUpgradeTxnResponse = await hre.upgrades.upgradeProxy(vaultAddress, vaultContract);

    await vaultUpgradeTxnResponse.wait();

    log.info(`transactionResponse for  VaultProxy: ${vaultAddress} is: ${JSON.stringify(vaultUpgradeTxnResponse)}`);
    assert(vaultUpgradeTxnResponse.status == 0, "vaultUpgradeFailed");

    const implementationAddressTopicHash =  ethers.utils.keccak256(ethers.utils.solidityPack(["string"], ["Upgraded(address)"]));

    var newImplementationAddress;

    //lookup for implementationAddress in EventLog which has topic-0 matching implementationAddressTopicHash
    const transactionReceipt = await ethers.provider.getTransactionReceipt(vaultUpgradeTxnResponse.hash);

    const logs = transactionReceipt.logs;
    const logIndex = logs.length;

    for(let i =  0 ; i < logIndex; i++){
     
        let log = logs[i];

        if(log.topics[0] == implementationAddressTopicHash){
            newImplementationAddress = log.topics[1];
            break;
        }
    }
    
    logger.info(`Vault: ${vaultAddress} is Upgraded to new-implementationAddress: ${newImplementationAddress}`);
});