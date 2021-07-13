# Polygon-Mainnet Contracts Information:

---

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

---

## Common contracts:

|Sequence | Contract Name | Script Name |  Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c | https://polygonscan.com/address/0x7e428a383d0f3a3b8e2d4a0ca2cdde8792878e2c#code |
|2 | StaticsHelper | deploy-statichelper.task.ts | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf | https://polygonscan.com/address/0xc1f99f723c7bdf1313140bfa29390138f1b325bf#code |

---

## Tokens In Underlying:

|Sequence | Token Name | Token Address | PolygonScan |
|---|---|---|---|
| 1 | USDC   | 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174 |
| 2 | USDT   | 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f |
| 3 | DAI    | 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 |
| 4 | WETH   | 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 |
| 5 | WMATIC | 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 |
| 6 | SUSHI  | 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a | https://polygonscan.com/token/0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a |

---

## SushiHodlStrategyFactory

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan |
|---|---|---|---|---|---|
|1| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x8289E89e234A753A962a2C495382A28b5cB975D1 | https://polygonscan.com/address/0x8289E89e234A753A962a2C495382A28b5cB975D1#code |

---

## sushiHODL Strategies

---

### Strategy: SUSHIHODL-WMATIC-WETH-V1 <-> Underlying: WMATIC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 0 | [WMATIC-WETH](https://polygonscan.com/address/0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E#readContract) 0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E | [Token-0: WMATIC](https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270) 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x971b7D3AaC688340Abd3CeB740ea3F745A120df4 | https://polygonscan.com/address/0x971b7D3AaC688340Abd3CeB740ea3F745A120df4#code | https://polygonscan.com/address/0xEc82c1077CFA5AFe921791CEEbA286b6085152df#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0x0d6b9eeff96e9d0e6f50350e985b9cac3c2e3e55 | https://polygonscan.com/address/0x0d6b9eeff96e9d0e6f50350e985b9cac3c2e3e55#code |  [Strategy Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L23-L36)|


------

### Strategy: SUSHIHODL-USDC-WETH-V1 <-> Underlying: USDC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 1 | [USDC-WETH](https://polygonscan.com/address/0x34965ba0ac2451A34a0471F04CCa3F990b8dea27#readContract) 0x34965ba0ac2451A34a0471F04CCa3F990b8dea27 | [Token-0: USDC](https://polygonscan.com/address/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/config/deploy-config-vaults.ts#L31-L40) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0xfc80b0f2a74fC4bBf7aFbFC85306535b9732BD9e | https://polygonscan.com/address/0xfc80b0f2a74fC4bBf7aFbFC85306535b9732BD9e#code | https://polygonscan.com/address/0xEc82c1077CFA5AFe921791CEEbA286b6085152df#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0xa2037e339864cacae6c1f7024ceee14a94594939 | https://polygonscan.com/address/0xa2037e339864cacae6c1f7024ceee14a94594939#code | [Strategy Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L37-L50) |


------

### Strategy: SUSHIHODL-WETH-USDT-V1 <-> Underlying: WETH-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 2 | [WETH-USDT](https://polygonscan.com/address/0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9#readContract) 0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9 | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: USDT](https://polygonscan.com/address/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/config/deploy-config-vaults.ts#L41-L50) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x40bDFCA8d26d428E09ee5F5BBd1386c1A740F04d | https://polygonscan.com/address/0x40bDFCA8d26d428E09ee5F5BBd1386c1A740F04d#code | https://polygonscan.com/address/0xEc82c1077CFA5AFe921791CEEbA286b6085152df#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0x74b20c553102770157e6d2fd392bcee18bb5aaa8 | https://polygonscan.com/address/0x74b20c553102770157e6d2fd392bcee18bb5aaa8#code |[Strategy Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L51-L64) |

------

### Strategy: SUSHIHODL-WETH-DAI-V1 <-> Underlying: WETH-DAI

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 5 | [WETH-DAI](https://polygonscan.com/address/0x6FF62bfb8c12109E8000935A6De54daD83a4f39f#readContract) 0x6FF62bfb8c12109E8000935A6De54daD83a4f39f | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: DAI](https://polygonscan.com/address/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063) 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/config/deploy-config-vaults.ts#L51-L60) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x43D91F76081339bf76CeA90A3743E30E7Dc9AEF7 | https://polygonscan.com/address/0x43D91F76081339bf76CeA90A3743E30E7Dc9AEF7#code | https://polygonscan.com/address/0xEc82c1077CFA5AFe921791CEEbA286b6085152df#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0x45d1570d7252975465dcd4b1e6c8041470105681 | https://polygonscan.com/address/0x45d1570d7252975465dcd4b1e6c8041470105681#code |[Strategy Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L65-L78) |

------

### Strategy: SUSHIHODL-USDC-USDT-V1 <-> Underlying: USDC-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 8 | [USDC-USDT](https://polygonscan.com/address/0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001#readContract) 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 | [Token-0: USDC](https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: USDT](https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/config/deploy-config-vaults.ts#L61-L70) |

| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x8B5Ee8CA6b9a690f1dc0bfeA14a355A244307CDa | https://polygonscan.com/address/0x8B5Ee8CA6b9a690f1dc0bfeA14a355A244307CDa#code | https://polygonscan.com/address/0xEc82c1077CFA5AFe921791CEEbA286b6085152df#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan |StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0xe42e4a8ca302921c9f6cf3b5ce0aba5e639e661e | https://polygonscan.com/address/0xe42e4a8ca302921c9f6cf3b5ce0aba5e639e661e#code | [Strategy Config](https://github.com/ForceDAO/force-core/blob/feat/UpgradeVault/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L79-L92) |
