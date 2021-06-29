# Polygon-Mainnet Contracts Information:

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

## Common contracts:

|Sequence | Contract Name | Script Name |  Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c | https://polygonscan.com/address/0x7e428a383d0f3a3b8e2d4a0ca2cdde8792878e2c#code |
|2 | StaticsHelper | deploy-statichelper.task.ts | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf | https://polygonscan.com/address/0xc1f99f723c7bdf1313140bfa29390138f1b325bf#code |

## Tokens In Underlying:

|Sequence | Token Name | Token Address | PolygonScan |
|---|---|---|---|
| 1 | USDC   | 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174 |
| 2 | USDT   | 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f |
| 3 | DAI    | 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 |
| 4 | WETH   | 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 |
| 5 | WMATIC | 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 |
| 6 | SUSHI  | 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a | https://polygonscan.com/token/0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a |


## SushiHodlStrategyFactory

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan |
|---|---|---|---|---|---|
|1| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 | https://polygonscan.com/address/0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9#code |

## sushiHODL Strategies

### Strategy: SUSHIHODL-WMATIC-WETH-V1 <-> Underlying: WMATIC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|
| 0 | [WMATIC-WETH](https://polygonscan.com/address/0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E#readContract) 0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E | [Token-0: WMATIC](https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270) 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/vaultProxyUpgradeTask/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  |  |


### Strategy: SUSHIHODL-USDC-WETH-V1 <-> Underlying: USDC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|
| 1 | [USDC-WETH](https://polygonscan.com/address/0x34965ba0ac2451A34a0471F04CCa3F990b8dea27#readContract) 0x34965ba0ac2451A34a0471F04CCa3F990b8dea27 | [Token-0: USDC](https://polygonscan.com/address/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/vaultProxyUpgradeTask/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts |  | |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  |  | |


### Strategy: SUSHIHODL-WETH-USDT-V1 <-> Underlying: WETH-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|
| 2 | [WETH-USDT](https://polygonscan.com/address/0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9#readContract) 0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9 | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: USDT](https://polygonscan.com/address/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/vaultProxyUpgradeTask/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | | |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  |  | |


### Strategy: SUSHIHODL-WETH-DAI-V1 <-> Underlying: WETH-DAI

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 5 | [WETH-DAI](https://polygonscan.com/address/0x6FF62bfb8c12109E8000935A6De54daD83a4f39f#readContract) 0x6FF62bfb8c12109E8000935A6De54daD83a4f39f | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: DAI](https://polygonscan.com/address/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063) 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/vaultProxyUpgradeTask/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | | |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  |  | |


### Strategy: SUSHIHODL-USDC-USDT-V1 <-> Underlying: USDC-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 8 | [USDC-USDT](https://polygonscan.com/address/0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001#readContract) 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 | [Token-0: USDC](https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: USDT](https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/feat/vaultProxyUpgradeTask/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |

|Sequence | Contract Name | Script Name | Constructor Arguments | Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  |  |
