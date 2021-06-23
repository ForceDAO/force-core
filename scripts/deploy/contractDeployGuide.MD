# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c |
|2| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0x8D7f8722B796526B7DBe94055cb405148cc47719 |
|3| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 |
|4| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x40b14dd05873423f75eea6d0ab6c3a4805518e69 |
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
npx hardhat deploy-vault --network polygonmainnet
2021-06-23 18:15:58.837  INFO [scripts/deploy/deploy-Vault.task.ts:24 undefined.<anonymous>] ---------== deploy-Vault on network: polygonmainnet 
2021-06-23 18:16:02.866  INFO [scripts/deploy/deploy-Vault.task.ts:27 undefined.<anonymous>] --------- Must Do Activity: 0x8D7f8722B796526B7DBe94055cb405148cc47719 deploy-config.ts as: vaultAddress ---------  
2021-06-23 18:16:02.867  INFO [scripts/deploy/deploy-Vault.task.ts:31 undefined.<anonymous>] ---------== About to Initialise Vault: 0x8D7f8722B796526B7DBe94055cb405148cc47719 
2021-06-23 18:16:04.292  INFO [scripts/deploy/deploy-Vault.task.ts:45 undefined.<anonymous>] Initialised Vault: 0x8D7f8722B796526B7DBe94055cb405148cc47719 on network: polygonmainnet with arguments: 
 
2021-06-23 18:16:04.293  INFO [scripts/deploy/deploy-Vault.task.ts:46 undefined.<anonymous>] storageAddress: 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c 
2021-06-23 18:16:04.293  INFO [scripts/deploy/deploy-Vault.task.ts:47 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-23 18:16:04.294  INFO [scripts/deploy/deploy-Vault.task.ts:48 undefined.<anonymous>] toInvestNumerator: 1000 
2021-06-23 18:16:04.294  INFO [scripts/deploy/deploy-Vault.task.ts:49 undefined.<anonymous>] toInvestDenominator: 1000 
2021-06-23 18:16:04.295  INFO [scripts/deploy/deploy-Vault.task.ts:50 undefined.<anonymous>] totalSupplyCap: 10 
```

### SushiHodlStrategyFactory Deployment Log:

```
force-core % npx hardhat deploy-sushihodl-factory --network polygonmainnet
2021-06-23 18:18:42.894  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-23 18:18:47.030  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 is deployed on network: polygonmainnet 
```

### Create and initialise Strategy:

```
force-core % npx hardhat deploy-vault --network polygonmainnet
2021-06-23 18:15:58.837  INFO [scripts/deploy/deploy-Vault.task.ts:24 undefined.<anonymous>] ---------== deploy-Vault on network: pol
lakshmikanthp@lakshmikanths-MacBook-Pro force-core % npx hardhat deploy-sushihodl-factory --network polygonmainnet
2021-06-23 18:18:42.894  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:10 undefined.<anonymous>] ---------== deploy-sushiHodl-factory 
2021-06-23 18:18:47.030  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-factory.task.ts:14 undefined.<anonymous>] SushiHodlStrategyFactory: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 is deployed on network: polygonmainnet 
lakshmikanthp@lakshmikanths-MacBook-Pro force-core % npx hardhat deploy-sushihodl-strategy --network polygonmainnet
2021-06-23 18:21:04.433  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:49 undefined.<anonymous>] ---------== create-sushiHODLStrategy 
2021-06-23 18:21:07.558  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:72 undefined.<anonymous>] Created and Initialised SushiHodlStrategy: {"hash":"0x03631cd9c35bf4cb9127e8f782a0cc4e55bf2298fb64376df479b02a882d7e05","type":0,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0x9782968954A2948EB5A611235b7E3D227457DeC0","gasPrice":{"type":"BigNumber","hex":"0x02540be400"},"gasLimit":{"type":"BigNumber","hex":"0xd64c98"},"to":"0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9","value":{"type":"BigNumber","hex":"0x00"},"nonce":25,"data":"0x349f816c0000000000000000000000007e428a383d0f3a3b8e2d4a0ca2cdde8792878e2c0000000000000000000000004b1f1e2435a9c96f7330faea190ef6a7c8d700010000000000000000000000008d7f8722b796526b7dbe94055cb405148cc477190000000000000000000000000769fd68dfb93167989c6f7254cd0d766fb2841f00000000000000000000000000000000000000000000000000000000000000080000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b3f868e0be5597d5db7feb59e1cadbb0fdda50a000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f","r":"0xaf9ee69ba565611973642e2e654cbf5f60b02cce438765a8922b042313c1a903","s":"0x4a05ac740543eeb239502e79cda953b2a26b6fc3cad0d906788284a49ddc4427","v":309,"creates":null,"chainId":137} on network: polygonmainnet with arguments: 
 
2021-06-23 18:21:07.559  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:73 undefined.<anonymous>] sushiHodlStrategyFactoryAddress: 0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 
2021-06-23 18:21:07.559  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:74 undefined.<anonymous>] underlying: 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 
2021-06-23 18:21:07.560  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:75 undefined.<anonymous>] miniChefV2: 0x0769fd68dFb93167989C6f7254cd0D766Fb2841F 
2021-06-23 18:21:07.560  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:76 undefined.<anonymous>] poolId: 8 
2021-06-23 18:21:07.560  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:77 undefined.<anonymous>] routerAddressV2: 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506 
2021-06-23 18:21:07.561  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:78 undefined.<anonymous>] sushiTokenAddress: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a 
2021-06-23 18:21:07.580  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:79 undefined.<anonymous>] wmaticTokenAddress: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 
2021-06-23 18:21:07.581  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:80 undefined.<anonymous>] routeSushiToken0: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-23 18:21:07.581  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:81 undefined.<anonymous>] routeSushiToken1: 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
2021-06-23 18:21:07.582  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:82 undefined.<anonymous>] routeWmaticToken0: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
2021-06-23 18:21:07.583  INFO [scripts/deploy/strategy/sushiHODL/deploy-sushihodl-strategy.task.ts:83 undefined.<anonymous>] routeWmaticToken1: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270,0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
```

### StaticHelper Deployment Log:

```
force-core % npx hardhat deploy-staticshelper --network polygonmainnet
2021-06-23 18:17:27.328  INFO [scripts/deploy/deploy-staticshelper.task.ts:13 undefined.<anonymous>] ---------== deploy-statichelper on network: polygonmainnet 
2021-06-23 18:17:31.252  INFO [scripts/deploy/deploy-staticshelper.task.ts:16 undefined.<anonymous>] --------- Must Do Activity: 0xC1f99f723C7bDF1313140BFA29390138F1b325bf deploy-config.ts as: staticsHelper ---------  
```