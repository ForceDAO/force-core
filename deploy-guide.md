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

### WMATIC-USDT

```sh
npx hardhat deploy-vault --underlyingname WMATIC-WETH --network polygonmainnet
```

### USDC-WETH

```sh
npx hardhat deploy-vault --underlyingname USDC-WETH --network polygonmainnet
```

### WETH-USDT

```sh
npx hardhat deploy-vault --underlyingname WETH-USDT --network polygonmainnet
```

### WETH-DAI

```sh
npx hardhat deploy-vault --underlyingname WETH-DAI --network polygonmainnet
```

### USDC-USDT

```sh
npx hardhat deploy-vault --underlyingname USDC-USDT --network polygonmainnet
```

## Deploy SushiHodlStrategyFactory

```sh
npx hardhat deploy-sushihodl-factory --network polygonmainnet
```

## Deploy Strategy

### SUSHIHODL-WMATIC-WETH-V1

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WMATIC-WETH-V1 --network polygonmainnet
```

### WMATIC-USDT

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-WETH-V1 --network polygonmainnet
```

### SUSHIHODL-WETH-USDT-V1

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WETH-USDT-V1 --network polygonmainnet
```

### SUSHIHODL-WETH-DAI-V1

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WETH-DAI-V1 --network polygonmainnet
```

### SUSHIHODL-USDC-USDT-V1

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```


## set storage-variables To Vaults

### set Strategy


### update TotalSupplyCap





