# Guide to use the contract verification scripts

## Mainnet - Verified Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- Deployer: 0x9782968954A2948EB5A611235b7E3D227457DeC0

|Sequence | Contract Name | Verification Script Name | config reference | Deployed Contract Address | Verified code on Polygon-Mainnet |
|---|---|---|---|---|---|
|1 | Storage | verify-sushihodl-usdc-usdt-storage.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts | 0x14d305796672579ee5805c193e4c2A2636c6B61F | https://polygonscan.com/address/0x14d305796672579ee5805c193e4c2A2636c6B61F#code |
|2| Vault | verify-sushihodl-usdc-usdt-vault.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts | 0x8E379F2b3f42517Ae195EC4EE1781045DAc28937 | https://polygonscan.com/address/0x8E379F2b3f42517Ae195EC4EE1781045DAc28937#code |
|3| SushiHodlStrategyFactory | verify-sushihodl-factory.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-config.ts |  0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13 | https://polygonscan.com/address/0x8De1CDd4a292a65F1fbff4967ddE6d09cBC1FB13#code |
|4| MasterChefHodlStrategy | verify-sushihodl-usdc-usdt-strategy.task.ts | scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts  | 0x8eA874C0d1cA8C7F55B1FC5A3B0603D43D6a9f9E | https://polygonscan.com/address/0x8eA874C0d1cA8C7F55B1FC5A3B0603D43D6a9f9E#code |
|5| StaticsHelper | verify-statichelper.task.ts | - | 0x9A38bC56D3A81B7A8B73450c277891D4900c5870 | https://polygonscan.com/address/0x9A38bC56D3A81B7A8B73450c277891D4900c5870#code |

## Mainnet - Verification Steps:

- Contract verification scripts are under directory: verify/
- Strategy Factory verification script is located: verify/strategy/sushiHODL
- Strategy Contract verification scripts are located it's underlying: verify/strategy/sushiHODL/usdc-usdt

### contract addresses imported in verify scripts are from:

  - verification of factory of sushiHODL contracts uses:
    - deploy/strategy/sushiHODL/config/deploy-sushiHodl-config.ts
  
  - verification of vault, storage, strategy of sushiHODL contracts with USDC-USDT underlying uses:
    - deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config.ts
