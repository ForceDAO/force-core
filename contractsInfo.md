# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

## Common contracts:

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c |
|2 | StaticsHelper | deploy-statichelper.task.ts | | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf |

## Tokens In Underlying:

|Sequence | Token Name | Token Address | PolygonScan |
|---|---|---|---|
| 1 | USDC   | 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174 |
| 2 | USDT   | 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f |
| 3 | DAI    | 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 |
| 4 | WETH   | 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 |
| 5 | WMATIC | 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 |
| 6 | SUSHI  | 0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a | https://polygonscan.com/token/0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a |

## sushiHODL Strategy Contracts

### SushiHodlStrategyFactory

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 |


### WMATIC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address |
|---|---|---|---|
| 0 | (WMATIC-WETH)[https://polygonscan.com/address/0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E]  | (WMATIC)[https://polygonscan.com/readContract?m=normal&a=0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E&v=0x85de135ff062df790a5f20b79120f17d3da63b2d&t=false#readCollapse15]  | (WETH)[https://polygonscan.com/readContract?m=normal&a=0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E&v=0x85de135ff062df790a5f20b79120f17d3da63b2d&t=false#readCollapse15] |


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|




### USDC-USDT

| PoolId | Underlying Address | Underlying Name | Token-0 Address | Token-1 Address |
|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  


|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x26D79892361850E683BB87803D6C34E6D923BF8c |


### WETH-USDT

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|



### USDC-WETH

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|


### WETH-DAI

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|