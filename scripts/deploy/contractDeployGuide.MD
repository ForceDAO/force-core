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

- Create and initialise Strategy:

```
% npx hardhat deploy-sushihodl-strategy --network polygonmainnet
2021-06-18 18:23:08.626  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:49 undefined.<anonymous>] ---------== create-sushiHODLStrategy 
2021-06-18 18:23:11.729  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:72 undefined.<anonymous>] Created and Initialised SushiHodlStrategy: {"hash":"0x5f31bee5a2fb8c11bc9a070dd0fda0dc735a97c9790351d266147e80d84d2f55","type":0,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x9782968954A2948EB5A611235b7E3D227457DeC0","gasPrice":{"type":"BigNumber","hex":"0x02540be400"},"gasLimit":{"type":"BigNumber","hex":"0xd64c98"},"to":"0x1f3E124DcB6e817Fd4Ecf86b3f7376A937AFEc77","value":{"type":"BigNumber","hex":"0x00"},"nonce":8,"data":"0x349f816c00000000000000000000000014d305796672579ee5805c193e4c2a2636c6b61f0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000008e379f2b3f42517ae195ec4ee1781045dac289370000000000000000000000000769fd68dfb93167989c6f7254cd0d766fb2841f00000000000000000000000000000000000000000000000000000000000000080000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f","r":"0x586419b1f96d0385ab95634b32326b0b029dbc8b8862a0ad5b4024cb5b4af915","s":"0x1802e3e06237402fefc349a2ffa6c82e98c6c0758994f6058e3ce45451ca6544","v":309,"creates":null,"chainId":137} on network: polygonmainnet with arguments: 
 
2021-06-18 18:23:11.731  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:73 undefined.<anonymous>] sushiHodlStrategyFactoryAddress: 0x1f3E124DcB6e817Fd4Ecf86b3f7376A937AFEc77 
2021-06-18 18:23:11.732  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:74 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-18 18:23:11.733  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:75 undefined.<anonymous>] miniChefV2: 0x0769fd68dFb93167989C6f7254cd0D766Fb2841F 
2021-06-18 18:23:11.734  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:76 undefined.<anonymous>] poolId: 8 
2021-06-18 18:23:11.735  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:77 undefined.<anonymous>] routerAddressV2: 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506 
2021-06-18 18:23:11.750  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:78 undefined.<anonymous>] sushiTokenAddress: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a 
2021-06-18 18:23:11.751  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:79 undefined.<anonymous>] wmaticTokenAddress: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 
2021-06-18 18:23:11.752  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:80 undefined.<anonymous>] routeSushiToken0: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-18 18:23:11.753  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:81 undefined.<anonymous>] routeSushiToken1: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
2021-06-18 18:23:11.754  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:82 undefined.<anonymous>] routeWmaticToken0: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-18 18:23:11.763  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:83 undefined.<anonymous>] routeWmaticToken1: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
```