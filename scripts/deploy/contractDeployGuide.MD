# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c |
|2| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 |
|3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 |
|4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x26D79892361850E683BB87803D6C34E6D923BF8c |
|5| StaticsHelper | deploy-statichelper.task.ts | | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf |

## Mainnet - Deployment Log:

### Storage Deployment Log:

```
force-core % npx hardhat deploy-storage --network polygonmainnet
2021-06-23 18:13:59.933  INFO [scripts/deploy/deploy-Storage.task.ts:10 undefined.<anonymous>] Deploying Storage.sol 
2021-06-23 18:14:04.528  INFO [scripts/deploy/deploy-Storage.task.ts:14 undefined.<anonymous>] Deployment log for network:  polygonmainnet 
2021-06-23 18:14:04.529  INFO [scripts/deploy/deploy-Storage.task.ts:15 undefined.<anonymous>] Deployed address: 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c 
```

### Vault Deployment Log:

```
force-core % npx hardhat  deploy-vault --underlyingname USDC-USDT  --network polygonmainnet  --show-stack-traces
2021-06-28 18:59:30.845  INFO [scripts/deploy/deploy-Vault.task.ts:26 undefined.<anonymous>] ---------== deploy-Vault on network: polygonmainnet 
Warning: Potentially unsafe deployment of Vault

    You are using the `unsafeAllow.constructor` flag.

2021-06-28 18:59:38.460  INFO [scripts/deploy/deploy-Vault.task.ts:43 undefined.<anonymous>] --------- Must Do Activity: 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 deploy-config-vaults.ts as: vaultAddress ---------  
2021-06-28 18:59:38.460  INFO [scripts/deploy/deploy-Vault.task.ts:45 undefined.<anonymous>] Initialised Vault: 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 on network: polygonmainnet with arguments: 
 
2021-06-28 18:59:38.461  INFO [scripts/deploy/deploy-Vault.task.ts:46 undefined.<anonymous>] storageAddress: 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c 
2021-06-28 18:59:38.461  INFO [scripts/deploy/deploy-Vault.task.ts:47 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-28 18:59:38.461  INFO [scripts/deploy/deploy-Vault.task.ts:48 undefined.<anonymous>] toInvestNumerator: 1000 
2021-06-28 18:59:38.462  INFO [scripts/deploy/deploy-Vault.task.ts:49 undefined.<anonymous>] toInvestDenominator: 1000 
2021-06-28 18:59:38.462  INFO [scripts/deploy/deploy-Vault.task.ts:50 undefined.<anonymous>] totalSupplyCap: 10
```

### SushiHodlStrategyFactory Deployment Log:

```
force-core % npx hardhat deploy-sushihodl-factory --network polygonmainnet
2021-06-23 18:18:42.894  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-23 18:18:47.030  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 is deployed on network: polygonmainnet 
```

### Create and initialise Strategy:

```
force-core % npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
2021-06-28 19:12:00.404  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:51 undefined.<anonymous>] ---------== create-sushiHODLStrategy 
2021-06-28 19:12:03.526  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:74 undefined.<anonymous>] Created and Initialised SushiHodlStrategy: {"hash":"0xa246352dfb85422a5496a4feef9df1d9fa20e51a634027b9d8fe3fe60eccb074","type":0,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x9782968954A2948EB5A611235b7E3D227457DeC0","gasPrice":{"type":"BigNumber","hex":"0x02540be400"},"gasLimit":{"type":"BigNumber","hex":"0xd64c58"},"to":"0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9","value":{"type":"BigNumber","hex":"0x00"},"nonce":51,"data":"0x349f816c0000000000000000000000007e428a383d0f3a3b8e2d4a0ca2cdde8792878e2c0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d70001000000000000000000000000cde80036e5ba91d3caf62ce83a4ff83baf4f87380000000000000000000000000769fd68dfb93167989c6f7254cd0d766fb2841f00000000000000000000000000000000000000000000000000000000000000080000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f","r":"0x030aee93e24d5e7cd1cce3f86a1453eaafc9132f46c4b3ef454c3320c6ab1fc9","s":"0x4d789560d0c9af18ee1910855b1bea08194e11cb27a1891eb9aad3cdb0d5f106","v":310,"creates":null,"chainId":137} on network: polygonmainnet with arguments: 
 
2021-06-28 19:12:03.528  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:75 undefined.<anonymous>] sushiHodlStrategyFactoryAddress: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 
2021-06-28 19:12:03.528  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:76 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-28 19:12:03.529  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:77 undefined.<anonymous>] miniChefV2: 0x0769fd68dFb93167989C6f7254cd0D766Fb2841F 
2021-06-28 19:12:03.530  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:78 undefined.<anonymous>] poolId: 8 
2021-06-28 19:12:03.530  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:79 undefined.<anonymous>] routerAddressV2: 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506 
2021-06-28 19:12:03.551  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:80 undefined.<anonymous>] sushiTokenAddress: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a 
2021-06-28 19:12:03.552  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:81 undefined.<anonymous>] wmaticTokenAddress: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 
2021-06-28 19:12:03.552  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:82 undefined.<anonymous>] routeSushiToken0: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-28 19:12:03.553  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:83 undefined.<anonymous>] routeSushiToken1: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
2021-06-28 19:12:03.553  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:84 undefined.<anonymous>] routeWmaticToken0: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-28 19:12:03.564  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:85 undefined.<anonymous>] routeWmaticToken1: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
```

### StaticHelper Deployment Log:

```
force-core % npx hardhat deploy-staticshelper --network polygonmainnet
2021-06-23 18:17:27.328  INFO [scripts/deploy/deploy-staticshelper.task.ts:13 undefined.<anonymous>] ---------== deploy-statichelper on network: polygonmainnet 
2021-06-23 18:17:31.252  INFO [scripts/deploy/deploy-staticshelper.task.ts:16 undefined.<anonymous>] --------- Must Do Activity: 0xC1f99f723C7bDF1313140BFA29390138F1b325bf deploy-config.ts as: staticsHelper ---------  
```


### set Strategy to the Vault:

```
force-core % npx hardhat set-strategy --underlyingname USDC-USDT --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
2021-06-28 19:19:35.860  INFO [scripts/vaults/set-strategy.task.ts:19 undefined.<anonymous>] vaultAddress : 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 for underlying: USDC-USDT 
2021-06-28 19:19:35.862  INFO [scripts/vaults/set-strategy.task.ts:23 undefined.<anonymous>] strategyAddress : 0x26D79892361850E683BB87803D6C34E6D923BF8c for underlying: USDC-USDT 
2021-06-28 19:19:35.862  INFO [scripts/vaults/set-strategy.task.ts:27 undefined.<anonymous>] ---------== About to set Strategy: 0x26D79892361850E683BB87803D6C34E6D923BF8c for Vault: 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 
```

### query Strategy of deployed Vault 

```
force-core % npx hardhat query-vault --underlyingname USDC-USDT --network polygonmainnet
2021-06-28 19:24:33.722  INFO [scripts/vaults/query-vault.task.ts:24 undefined.<anonymous>] strategyAddress for Proxy: 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 is: 0x26D79892361850E683BB87803D6C34E6D923BF8c 
```