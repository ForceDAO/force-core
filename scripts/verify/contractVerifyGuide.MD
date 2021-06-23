# Guide to use the contract verification scripts

## Mainnet - Verified Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Verification Script Name | config reference | Deployed Contract Address | Verified code on Polygon-Mainnet |
|---|---|---|---|---|---|
|1 | Storage | verify-sushihodl-usdc-usdt-storage.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts | 0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c | https://polygonscan.com/address/0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c#code |
|2| Vault | verify-sushihodl-usdc-usdt-vault.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts | 0x8D7f8722B796526B7DBe94055cb405148cc47719 | https://polygonscan.com/address/0x8D7f8722B796526B7DBe94055cb405148cc47719#code |
|3| SushiHodlStrategyFactory | verify-sushihodl-factory.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-config.ts |  0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9 | https://polygonscan.com/address/0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9#code |
|4| MasterChefHodlStrategy | verify-sushihodl-usdc-usdt-strategy.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts  | 0x5e6dccb2df12d78c13fb1e3195f05f1afefce5d1 | https://polygonscan.com/address/0x5e6dccb2df12d78c13fb1e3195f05f1afefce5d1#code |
|5| StaticsHelper | verify-statichelper.task.ts | - | 0xC1f99f723C7bDF1313140BFA29390138F1b325bf | https://polygonscan.com/address/0xC1f99f723C7bDF1313140BFA29390138F1b325bf#code |

## Mainnet - Verification Steps:

- Contract verification scripts are under directory: verify/
- Strategy Factory verification script is located: verify/strategy/sushiHODL
- Strategy Contract verification scripts are located it's underlying: verify/strategy/sushiHODL/usdc-usdt

### contract addresses imported in verify scripts are from:

  - verification of factory of sushiHODL contracts uses:
    - deploy/strategy/sushiHODL/config/deploy-sushiHodl-config.ts
  
  - verification of vault, storage, strategy of sushiHODL contracts with USDC-USDT underlying uses:
    - deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts
