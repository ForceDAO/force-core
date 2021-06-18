# Guide to use the contract deployment scripts

## List of scripts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending

  |Sequence | Contract Name | Script Name | Constructor Arguments | Description |
  |---|---|---|---|---|
  |1 | Storage | deploy-storage.task.ts | - | Storage contract -> Copy the deployed contract address to .env |
  |2| Vault | deploy-Vault.task.ts | Controller | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |
  |3| FeeRewardForwarder | deploy-FeeRewardForwarder.task.ts | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |
  |4| Controller | deploy-Controller.task.ts | Storage, FeeRewardForwarder | For constructor Argument, refer to the storageAddress, feeRewardForwarderAddress in deploy-config.ts |
  |6| NoMintRewardPool | deploy-NoMintRewardPool.task.ts | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts |

## Mainnet - Deployed Contracts:

Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0xf92C971628828b3d2fb091FD6343DEd5Bb3234Eb |
|2| Vault | deploy-Vault.task.ts | - | 0x14d305796672579ee5805c193e4c2A2636c6B61F |

## Mainnet - Deployment Log:

```
% npx hardhat deploy-vault --network polygonmainnet
2021-06-18 16:22:35.848  INFO [scripts/deploy/deploy-Vault.task.ts:12 undefined.<anonymous>] ---------== deploy-Vault 
2021-06-18 16:22:40.527  INFO [scripts/deploy/deploymentLogUtils.ts:6  Object.logDeployment] Deployment log for network:  polygonmainnet 
2021-06-18 16:22:40.528  INFO [scripts/deploy/deploymentLogUtils.ts:7  Object.logDeployment] Txn Hash:  0x62e1e8b38f64497d88a3ee3a990a5468ad14225e005b9807ebe79491792d9541 
2021-06-18 16:22:40.529  INFO [scripts/deploy/deploymentLogUtils.ts:8  Object.logDeployment] deployed instCtrt: 0xf92C971628828b3d2fb091FD6343DEd5Bb3234Eb 
2021-06-18 16:22:40.529  INFO [scripts/deploy/deploy-Vault.task.ts:17 undefined.<anonymous>] --------- Must Do Activity: 0xf92C971628828b3d2fb091FD6343DEd5Bb3234Eb deploy-config.ts as: vaultAddress ---------  
```

```
% npx hardhat deploy-storage --network polygonmainnet
2021-06-18 16:23:17.768  INFO [scripts/deploy/deploy-Storage.task.ts:10 undefined.<anonymous>] Deploying Storage.sol 
2021-06-18 16:23:21.059  INFO [scripts/deploy/deploy-Storage.task.ts:14 undefined.<anonymous>] Deployment log for network:  polygonmainnet 
2021-06-18 16:23:21.060  INFO [scripts/deploy/deploy-Storage.task.ts:15 undefined.<anonymous>] Deployed address: 0x14d305796672579ee5805c193e4c2A2636c6B61F 
```
