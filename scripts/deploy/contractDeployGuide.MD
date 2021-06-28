# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c |
|2| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0x8D7f8722B796526B7DBe94055cb405148cc47719 |
|3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 |
|4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x5e6dccb2df12d78c13fb1e3195f05f1afefce5d1 |
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
force-core % npx hardhat  deploy-vault --underlyingname USDC-USDT  --network hardhat
2021-06-28 14:37:23.341  INFO [scripts/deploy/deploy-Vault.task.ts:26 undefined.<anonymous>] ---------== deploy-Vault on network: hardhat 
Warning: Potentially unsafe deployment of Vault

    You are using the `unsafeAllow.constructor` flag.

2021-06-28 14:37:39.798  INFO [scripts/deploy/deploy-Vault.task.ts:43 undefined.<anonymous>] --------- Must Do Activity: 0xCa57C1d3c2c35E667745448Fef8407dd25487ff8 deploy-config-vaults.ts as: vaultAddress ---------  
2021-06-28 14:37:39.801  INFO [scripts/deploy/deploy-Vault.task.ts:46 undefined.<anonymous>] Vault Proxy has implementation: 0xd0EC100F1252a53322051a95CF05c32f0C174354 
2021-06-28 14:37:39.801  INFO [scripts/deploy/deploy-Vault.task.ts:48 undefined.<anonymous>] Initialised Vault: 0xCa57C1d3c2c35E667745448Fef8407dd25487ff8 on network: hardhat with arguments: 
 
2021-06-28 14:37:39.802  INFO [scripts/deploy/deploy-Vault.task.ts:49 undefined.<anonymous>] storageAddress: 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c 
2021-06-28 14:37:39.802  INFO [scripts/deploy/deploy-Vault.task.ts:50 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-28 14:37:39.802  INFO [scripts/deploy/deploy-Vault.task.ts:51 undefined.<anonymous>] toInvestNumerator: 1000 
2021-06-28 14:37:39.802  INFO [scripts/deploy/deploy-Vault.task.ts:52 undefined.<anonymous>] toInvestDenominator: 1000 
2021-06-28 14:37:39.809  INFO [scripts/deploy/deploy-Vault.task.ts:53 undefined.<anonymous>] totalSupplyCap: 10 
lakshmikanthp@lakshmikanths-MacBook-Pro force-core % 
```

### SushiHodlStrategyFactory Deployment Log:

```
force-core % npx hardhat deploy-sushihodl-factory --network polygonmainnet
2021-06-23 18:18:42.894  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-23 18:18:47.030  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 is deployed on network: polygonmainnet 
```

### Create and initialise Strategy:

```
 % npx hardhat deploy-sushihodl-strategy --network polygonmainnet
2021-06-23 18:58:12.591  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:49 undefined.<anonymous>] ---------== create-sushiHODLStrategy 
2021-06-23 18:58:16.071  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:72 undefined.<anonymous>] Created and Initialised SushiHodlStrategy: {"hash":"0xbdf49b48c646cb7dbffc63993816e87040a51830b6956a87c0ed799f03fd9011","type":0,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x9782968954A2948EB5A611235b7E3D227457DeC0","gasPrice":{"type":"BigNumber","hex":"0x02540be400"},"gasLimit":{"type":"BigNumber","hex":"0xd64c98"},"to":"0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9","value":{"type":"BigNumber","hex":"0x00"},"nonce":26,"data":"0x349f816c0000000000000000000000007e428a383d0f3a3b8e2d4a0ca2cdde8792878e2c0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000008d7f8722b796526b7dbe94055cb405148cc477190000000000000000000000000769fd68dfb93167989c6f7254cd0d766fb2841f00000000000000000000000000000000000000000000000000000000000000080000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f","r":"0x7982044a9cbe757f68f4af3099ce0084ac309adfafdbe15cab6b72b6a68aa229","s":"0x425e5f82410aad9fdb5d915f8a0d441ddfffb09b3b891dc68a370d65d205aa02","v":310,"creates":null,"chainId":137} on network: polygonmainnet with arguments: 
 
2021-06-23 18:58:16.072  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:73 undefined.<anonymous>] sushiHodlStrategyFactoryAddress: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 
2021-06-23 18:58:16.072  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:74 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-23 18:58:16.073  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:75 undefined.<anonymous>] miniChefV2: 0x0769fd68dFb93167989C6f7254cd0D766Fb2841F 
2021-06-23 18:58:16.073  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:76 undefined.<anonymous>] poolId: 8 
2021-06-23 18:58:16.074  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:77 undefined.<anonymous>] routerAddressV2: 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506 
2021-06-23 18:58:16.074  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:78 undefined.<anonymous>] sushiTokenAddress: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a 
2021-06-23 18:58:16.087  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:79 undefined.<anonymous>] wmaticTokenAddress: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 
2021-06-23 18:58:16.088  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:80 undefined.<anonymous>] routeSushiToken0: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-23 18:58:16.089  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:81 undefined.<anonymous>] routeSushiToken1: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
2021-06-23 18:58:16.089  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:82 undefined.<anonymous>] routeWmaticToken0: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-23 18:58:16.090  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:83 undefined.<anonymous>] routeWmaticToken1: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
```

### StaticHelper Deployment Log:

```
force-core % npx hardhat deploy-staticshelper --network polygonmainnet
2021-06-23 18:17:27.328  INFO [scripts/deploy/deploy-staticshelper.task.ts:13 undefined.<anonymous>] ---------== deploy-statichelper on network: polygonmainnet 
2021-06-23 18:17:31.252  INFO [scripts/deploy/deploy-staticshelper.task.ts:16 undefined.<anonymous>] --------- Must Do Activity: 0xC1f99f723C7bDF1313140BFA29390138F1b325bf deploy-config.ts as: staticsHelper ---------  
```