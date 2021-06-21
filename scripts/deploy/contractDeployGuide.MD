# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x14d305796672579ee5805c193e4c2A2636c6B61F |
|2| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 |
|3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13 |
|4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x8eA874C0d1cA8C7F55B1FC5A3B0603D43D6a9f9E |
|5| StaticsHelper | deploy-statichelper.task.ts | | 0x9A38bC56D3A81B7A8B73450c277891D4900c5870 |

## Mainnet - Deployment Log:

### Storage Deployment Log:

```
% npx hardhat deploy-storage --network polygonmainnet
2021-06-18 16:23:17.768  INFO [scripts/deploy/deploy-Storage.task.ts:10 undefined.<anonymous>] Deploying Storage.sol 
2021-06-18 16:23:21.059  INFO [scripts/deploy/deploy-Storage.task.ts:14 undefined.<anonymous>] Deployment log for network:  polygonmainnet 
2021-06-18 16:23:21.060  INFO [scripts/deploy/deploy-Storage.task.ts:15 undefined.<anonymous>] Deployed address: 0x14d305796672579ee5805c193e4c2A2636c6B61F 
```

### Vault Deployment Log:

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

### SushiHodlStrategyFactory Deployment Log:

```
% npx hardhat deploy-sushihodl-factory --network polygonmainnet 
2021-06-18 19:39:35.518  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-18 19:39:39.453  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13 is deployed on network: polygonmainnet 
```

### Create and initialise Strategy:

```
% npx hardhat deploy-sushihodl-strategy --network polygonmainnet
2021-06-18 19:40:00.298  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:49 undefined.<anonymous>] ---------== create-sushiHODLStrategy 
2021-06-18 19:40:02.297  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:72 undefined.<anonymous>] Created and Initialised SushiHodlStrategy: {"hash":"0x23bccbe9d946c83ac91dde8390bd7cc18d2b44ff11253e205628c29ab050b7a2","type":0,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x9782968954A2948EB5A611235b7E3D227457DeC0","gasPrice":{"type":"BigNumber","hex":"0x02540be400"},"gasLimit":{"type":"BigNumber","hex":"0xd64c98"},"to":"0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13","value":{"type":"BigNumber","hex":"0x00"},"nonce":18,"data":"0x349f816c00000000000000000000000014d305796672579ee5805c193e4c2a2636c6b61f0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000008e379f2b3f42517ae195ec4ee1781045dac289370000000000000000000000000769fd68dfb93167989c6f7254cd0d766fb2841f00000000000000000000000000000000000000000000000000000000000000080000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f","r":"0xc15ee56f94c9d4fc9464cc446c213591042795451f8917e8d64c84353db6b599","s":"0x36c41729d4c0f2091c05ddb721beda38a0f5e2f6c8e03d23c75377155afc39a2","v":309,"creates":null,"chainId":137} on network: polygonmainnet with arguments: 
 
2021-06-18 19:40:02.299  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:73 undefined.<anonymous>] sushiHodlStrategyFactoryAddress: 0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13 
2021-06-18 19:40:02.300  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:74 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-18 19:40:02.301  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:75 undefined.<anonymous>] miniChefV2: 0x0769fd68dFb93167989C6f7254cd0D766Fb2841F 
2021-06-18 19:40:02.303  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:76 undefined.<anonymous>] poolId: 8 
2021-06-18 19:40:02.325  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:77 undefined.<anonymous>] routerAddressV2: 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506 
2021-06-18 19:40:02.325  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:78 undefined.<anonymous>] sushiTokenAddress: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a 
2021-06-18 19:40:02.326  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:79 undefined.<anonymous>] wmaticTokenAddress: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 
2021-06-18 19:40:02.327  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:80 undefined.<anonymous>] routeSushiToken0: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-18 19:40:02.327  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:81 undefined.<anonymous>] routeSushiToken1: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
2021-06-18 19:40:02.332  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:82 undefined.<anonymous>] routeWmaticToken0: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-18 19:40:02.332  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:83 undefined.<anonymous>] routeWmaticToken1: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
```

### StaticHelper Deployment Log:

```
% npx hardhat deploy-staticshelper --network polygonmainnet
2021-06-18 19:57:50.693  INFO [scripts/deploy/deploy-staticshelper.task.ts:13 undefined.<anonymous>] ---------== deploy-statichelper on network: polygonmainnet 
2021-06-18 19:57:53.762  INFO [scripts/deploy/deploy-staticshelper.task.ts:16 undefined.<anonymous>] --------- Must Do Activity: 0x9A38bC56D3A81B7A8B73450c277891D4900c5870 deploy-config.ts as: staticsHelper ---------  
```