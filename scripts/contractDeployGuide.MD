# Guide to use the contract deployment scripts

## List of scripts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending

  |Sequence | Contract Name | Script Name | Constructor Arguments | Description |
  |---|---|---|---|---|
  |1 | Storage | deploy-storage.task.ts | - | Storage contract -> Copy the deployed contract address to .env |
  |2| FarmRewardToken | deploy-FarmRwToken.task.ts| Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |
  |3| FeeRewardForwarder | deploy-FeeRewardForwarder.task.ts | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |
  |4| Controller | deploy-Controller.task.ts | Storage, FeeRewardForwarder | For constructor Argument, refer to the storageAddress, feeRewardForwarderAddress in deploy-config.ts |
  |5| Vault | deploy-Vault.task.ts | Controller | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |
  |6| NoMintRewardPool | deploy-NoMintRewardPool.task.ts | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |






## TODO

```
    //TODO - create a file to store JSON Object with contract addresses (deployed contracts)
    //TODO - write the deployed Storage-contract address (to the JSON file)
    //TODO - use the Storage-contract address (from the file)
    //TODO - remove numbers from the filename of deployment scripts

- store storage contract - deployed address to 
```