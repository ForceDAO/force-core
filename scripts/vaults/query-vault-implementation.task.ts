import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
import { getVaultImplementationFromTransactionHash } from "../helper/transaction-event-log-query";
const log: Logger = new Logger();

task("query-vault-implementation", "Query a Vault Proxy contract")
  .addParam("transactionhash","transactionHash of the Vault deployment/Upgrade")
  .setAction(async (args, hre) => {
  const transactionhash : string = args.transactionhash;
  const implementationAddress = await getVaultImplementationFromTransactionHash(transactionhash, hre);
  log.info(`Vault's implementationAddress is: ${implementationAddress}`);
});