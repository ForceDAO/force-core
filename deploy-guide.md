# Contract Deployment Guide:

## Deploy StaticHelper

```sh
npx hardhat deploy-staticshelper --network polygonmainnet
```

## Deploy Storage

```sh
npx hardhat deploy-storage --network polygonmainnet
```

## Deploy Vaults

```sh
npx hardhat deploy-vault --underlyingname USDC-USDT --network polygonmainnet
```

### Record VaultProxyAddress in deploy-config:

- 

## Deploy SushiHodlStrategyFactory

```sh
npx hardhat deploy-sushihodl-factory --network polygonmainnet
```

## Deploy Strategy

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```

## Initialise Vaults

