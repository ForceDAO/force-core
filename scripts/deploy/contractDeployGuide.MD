# Guide to use the contract deployment scripts

## List of scripts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending

  |Sequence | Contract Name | Script Name | Constructor Arguments | Description |
  |---|---|---|---|---|
  |1 | Storage | deploy-storage.task.ts | - | Storage contract -> Copy the deployed contract address to .env |
  |2| Vault | deploy-Vault.task.ts | Controller | Storage | For constructor Argument, refer to the storageAddress in deploy-config.ts & For initialise arguments refer to vaultInit in deploy-config.ts |
  |3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - | No Constructor arguments. |
  |4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | | For Constructor arguments refer to:  |



## Mainnet - Deployed Contracts:

Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0xf92C971628828b3d2fb091FD6343DEd5Bb3234Eb |
|2| Vault | deploy-Vault.task.ts | - | 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 |
|3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x1f3E124DcB6e817Fd4Ecf86b3f7376A937AFEc77 |
|4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | | |

## Mainnet - Deployment Log:

- Storage Deployment Log:

```
% npx hardhat deploy-storage --network polygonmainnet
2021-06-18 16:23:17.768  INFO [scripts/deploy/deploy-Storage.task.ts:10 undefined.<anonymous>] Deploying Storage.sol 
2021-06-18 16:23:21.059  INFO [scripts/deploy/deploy-Storage.task.ts:14 undefined.<anonymous>] Deployment log for network:  polygonmainnet 
2021-06-18 16:23:21.060  INFO [scripts/deploy/deploy-Storage.task.ts:15 undefined.<anonymous>] Deployed address: 0x14d305796672579ee5805c193e4c2A2636c6B61F 
```

- Vault Deployment Log:

```
% npx hardhat deploy-vault --network polygonmainnet
2021-06-18 17:32:40.118  INFO [scripts/deploy/deploy-Vault.task.ts:24 undefined.<anonymous>] ---------== deploy-Vault on network: polygonmainnet 
2021-06-18 17:32:44.105  INFO [scripts/deploy/deploy-Vault.task.ts:27 undefined.<anonymous>] --------- Must Do Activity: 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 deploy-config.ts as: vaultAddress ---------  
2021-06-18 17:32:44.105  INFO [scripts/deploy/deploy-Vault.task.ts:31 undefined.<anonymous>] ---------== About to Initialise Vault: 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 
2021-06-18 17:32:45.405  INFO [scripts/deploy/deploy-Vault.task.ts:45 undefined.<anonymous>] Initialised Vault: 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 on network: polygonmainnet with arguments: 
 
2021-06-18 17:32:45.406  INFO [scripts/deploy/deploy-Vault.task.ts:46 undefined.<anonymous>] storageAddress: 0x14d305796672579ee5805c193e4c2A2636c6B61F 
2021-06-18 17:32:45.407  INFO [scripts/deploy/deploy-Vault.task.ts:47 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-18 17:32:45.408  INFO [scripts/deploy/deploy-Vault.task.ts:48 undefined.<anonymous>] toInvestNumerator: 1000 
2021-06-18 17:32:45.409  INFO [scripts/deploy/deploy-Vault.task.ts:49 undefined.<anonymous>] toInvestDenominator: 1000 
2021-06-18 17:32:45.410  INFO [scripts/deploy/deploy-Vault.task.ts:50 undefined.<anonymous>] totalSupplyCap: 10 
```

- SushiHodlStrategyFactory Deployment Log:

```
 % npx hardhat deploy-sushihodl-factory --network polygonmainnet
2021-06-18 17:51:47.922  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-18 17:51:52.877  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x1f3E124DcB6e817Fd4Ecf86b3f7376A937AFEc77 is deployed on network: polygonmainnet 
```