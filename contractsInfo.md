# Guide to use the contract deployment scripts

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

## Common contracts:

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | - | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c |
|2 | StaticsHelper | deploy-statichelper.task.ts | | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf |

## sushiHODL Strategy Contracts

### SushiHodlStrategyFactory

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 |

### USDC-USDT

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|
|1| Vault | deploy-Vault.task.ts | For initialise arguments refer to: scripts/config/deploy-config.ts | 0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738 |
|2| MasterChefHodlStrategy | deploy-sushihodl-strategy.task.ts | For initialise arguments refer to: scripts/strategy/sushiHODL/deploy-sushiHodl-config.ts & scripts/config/deploy-config.ts  | 0x26D79892361850E683BB87803D6C34E6D923BF8c |

### WMATIC-WETH

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|



### WETH-USDT

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|



### USDC-WETH

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|


### WETH-DAI

|Sequence | Contract Name | Script Name | Constructor Arguments | Deployed Contract Address |
|---|---|---|---|---|