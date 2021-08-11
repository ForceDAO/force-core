# Polygon-Mainnet Contracts Information:

---

## Mainnet - Deployed Contracts:

- table for contract-name and associated deployment-script & in order of execution-sequence ascending
- ProxyAdmin: 0xCE306b73cce8123FDEb5bDC40769955932b5Ed91
- Controller: 0x98eB66A5482eC00800996c09109F3d651929F407

---

## Common contracts:

|Sequence | Contract Name | Script Name |  Contract Address | PolygonScan Verified & Published |
|---|---|---|---|---|
|1 | Storage | deploy-storage.task.ts | 0x8dC3259991E22Ee5783aC5a15C371219e90A2c64 | https://polygonscan.com/address/0x8dC3259991E22Ee5783aC5a15C371219e90A2c64#code |
|2 | StaticsHelper | deploy-statichelper.task.ts | 0x6050c3eDe0eBfa89b9c5c95A4db9185C82F83b47 | https://polygonscan.com/address/0x6050c3eDe0eBfa89b9c5c95A4db9185C82F83b47#code |

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
|1| SushiHodlStrategyFactory | deploy-sushihodl-factory.task.ts | - |  0xFEbA6bDC3ccE74A977E9aa7E55964a9AE8C4F290 | https://polygonscan.com/address/0xFEbA6bDC3ccE74A977E9aa7E55964a9AE8C4F290#code |

---

## sushiHODL Strategies

---

### Strategy: SUSHIHODL-WMATIC-WETH-V1 <-> Underlying: WMATIC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 0 | [WMATIC-WETH](https://polygonscan.com/address/0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E#readContract) 0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E | [Token-0: WMATIC](https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270) 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/config/deploy-config-vaults.ts#L21-L30) |


| Contract Name |  VaultProxy Address | VaultProxy On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x7400DFCd9a001B15Affa0c5e2ED23C4fF25095A0 | https://polygonscan.com/address/0x7400DFCd9a001B15Affa0c5e2ED23C4fF25095A0#code | https://polygonscan.com/address/0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0xa51d2cad8a0c6b5fbea86faf91b64dc8238c98d8 | https://polygonscan.com/address/0xa51d2cad8a0c6b5fbea86faf91b64dc8238c98d8#code |  [Strategy Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L23-L36)|


------

### Strategy: SUSHIHODL-USDC-WETH-V1 <-> Underlying: USDC-WETH

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 1 | [USDC-WETH](https://polygonscan.com/address/0x34965ba0ac2451A34a0471F04CCa3F990b8dea27#readContract) 0x34965ba0ac2451A34a0471F04CCa3F990b8dea27 | [Token-0: USDC](https://polygonscan.com/address/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619 | [Vault Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/config/deploy-config-vaults.ts#L31-L40) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0xA79dBa8DC71C9A646e991D02712437Ae7cCfbEeB | https://polygonscan.com/address/0xA79dBa8DC71C9A646e991D02712437Ae7cCfbEeB#code | https://polygonscan.com/address/0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0xaaf1f4833667bbd88f8f13796c803fde1313b6e3 | https://polygonscan.com/address/0xaaf1f4833667bbd88f8f13796c803fde1313b6e3#code | [Strategy Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L37-L50) |


------

### Strategy: SUSHIHODL-WETH-USDT-V1 <-> Underlying: WETH-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 2 | [WETH-USDT](https://polygonscan.com/address/0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9#readContract) 0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9 | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: USDT](https://polygonscan.com/address/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/config/deploy-config-vaults.ts#L41-L50) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x705E15c2067643b9d4C9a03833B15b01fa758cE5 | https://polygonscan.com/address/0x705E15c2067643b9d4C9a03833B15b01fa758cE5#code | https://polygonscan.com/address/0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0x4b0b0ee58b27e8ec6d83d5d19326dd655d5ffbd9 | https://polygonscan.com/address/0x4b0b0ee58b27e8ec6d83d5d19326dd655d5ffbd9#code |[Strategy Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L51-L64) |

------

### Strategy: SUSHIHODL-WETH-DAI-V1 <-> Underlying: WETH-DAI

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 5 | [WETH-DAI](https://polygonscan.com/address/0x6FF62bfb8c12109E8000935A6De54daD83a4f39f#readContract) 0x6FF62bfb8c12109E8000935A6De54daD83a4f39f | [Token-0: WETH](https://polygonscan.com/address/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619) 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619  | [Token-1: DAI](https://polygonscan.com/address/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063) 0x8f3cf7ad23cd3cadbd9735aff958023239c6a063 | [Vault Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/config/deploy-config-vaults.ts#L51-L60) |


| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x51eD427cf626344aB0eB9E4E5BdD4ADE5803ee1D | https://polygonscan.com/address/0x51eD427cf626344aB0eB9E4E5BdD4ADE5803ee1D#code | https://polygonscan.com/address/0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan | StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0xc314183de29444d21991d1dba3133365909d8423 | https://polygonscan.com/address/0xc314183de29444d21991d1dba3133365909d8423#code |[Strategy Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L65-L78) |

------

### Strategy: SUSHIHODL-USDC-USDT-V1 <-> Underlying: USDC-USDT

| PoolId | Underlying Address | Token-0 Address | Token-1 Address | VaultInfo | 
|---|---|---|---|---|
| 8 | [USDC-USDT](https://polygonscan.com/address/0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001#readContract) 0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001 | [Token-0: USDC](https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174) 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 | [Token-1: USDT](https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f) 0xc2132d05d31c914a87c6611c10748aeb04b58e8f | [Vault Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/config/deploy-config-vaults.ts#L61-L70) |

| Contract Name |  VaultProxy Address | VaultProxy  On PolygonScan | Vault-Implementation On PolygonScan |
|---|---|---|---|
| Vault | 0x127F52249fa07810a9c3937B3D2d3369859fF6Ab | https://polygonscan.com/address/0x127F52249fa07810a9c3937B3D2d3369859fF6Ab#code | https://polygonscan.com/address/0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9#code |


| Contract Name | Deployed Strategy Address | Strategy On PolygonScan |StrategyInfo |
|---|---|---|---|
| MasterChefHodlStrategy | 0x88bd5756c862bf9325ad537905c72b1ca4986c7a | https://polygonscan.com/address/0x88bd5756c862bf9325ad537905c72b1ca4986c7a#code | [Strategy Config](https://github.com/ForceDAO/force-core/blob/develop/scripts/deploy/strategy/sushiHODL/config/deploy-sushiHodl-polygon-mainnet-config.ts#L79-L92) |
