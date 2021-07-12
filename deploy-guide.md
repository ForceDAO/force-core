# Contract Deployment Guide:

## Deploy/Verify StaticHelper

- Deploy StaticHelper

```sh
npx hardhat deploy-staticshelper --network polygonmainnet
```

- Verify StaticHelper:

```sh
npx hardhat verify-staticshelper --network polygonmainnet
```

## Deploy/Verify Storage

- Deploy Storage

```sh
npx hardhat deploy-storage --network polygonmainnet
```

- Verify Storage:

```sh
npx hardhat verify-storage --network polygonmainnet
```

## Deploy/Initialize/Verify Vaults

### WMATIC-USDT

- Deploy & Initialize Vault:

```sh
npx hardhat deploy-vault --underlyingname WMATIC-WETH --network polygonmainnet
```

- Verify Vault:

```sh
npx hardhat verify-sushihodl-vault --underlyingname WMATIC-WETH --network polygonmainnet
```

### USDC-WETH

- Deploy & Initialize Vault:

```sh
npx hardhat deploy-vault --underlyingname USDC-WETH --network polygonmainnet
```

- Verify Vault:

```sh
npx hardhat verify-sushihodl-vault --underlyingname USDC-WETH --network polygonmainnet
```

### WETH-USDT

- Deploy & Initialize Vault:

```sh
npx hardhat deploy-vault --underlyingname WETH-USDT --network polygonmainnet
```

- Verify Vault:

```sh
npx hardhat verify-sushihodl-vault --underlyingname WETH-USDT --network polygonmainnet
```

### WETH-DAI

- Deploy & Initialize Vault:

```sh
npx hardhat deploy-vault --underlyingname WETH-DAI --network polygonmainnet
```

- Verify Vault:

```sh
npx hardhat verify-sushihodl-vault --underlyingname WETH-DAI --network polygonmainnet
```

### USDC-USDT

- Deploy & Initialize Vault:

```sh
npx hardhat deploy-vault --underlyingname USDC-USDT --network polygonmainnet
```

- Verify Vault:

```sh
npx hardhat verify-sushihodl-vault --underlyingname USDC-USDT --network polygonmainnet
```

## Deploy SushiHodlStrategyFactory

- Deploy SushiHodlStrategyFactory

```sh
npx hardhat deploy-sushihodl-factory --network polygonmainnet
```

- verify SushiHodlStrategyFactory

```sh
npx hardhat verify-sushihodl-factory --network polygonmainnet
```

## Create/initialize/Verify Strategy

### SUSHIHODL-WMATIC-WETH-V1

- Create/Initialize Strategy 

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WMATIC-WETH-V1 --network polygonmainnet
```

- Verify Strategy:

```sh
npx hardhat verify-sushihodl-strategy --strategyname SUSHIHODL-WMATIC-WETH-V1 --network polygonmainnet
```

### SUSHIHODL-USDC-WETH-V1

- Create/Initialize Strategy 

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-WETH-V1 --network polygonmainnet
```

- Verify Strategy:

```sh
npx hardhat verify-sushihodl-strategy --strategyname SUSHIHODL-USDC-WETH-V1 --network polygonmainnet
```

### SUSHIHODL-WETH-USDT-V1

- Create/Initialize Strategy 

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WETH-USDT-V1 --network polygonmainnet
```

- Verify Strategy:

```sh
npx hardhat verify-sushihodl-strategy --strategyname SUSHIHODL-WETH-USDT-V1 --network polygonmainnet
```

### SUSHIHODL-WETH-DAI-V1


- Create/Initialize Strategy 

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-WETH-DAI-V1 --network polygonmainnet
```

- Verify Strategy:

```sh
npx hardhat verify-sushihodl-strategy --strategyname SUSHIHODL-WETH-DAI-V1 --network polygonmainnet
```

### SUSHIHODL-USDC-USDT-V1

- Create/Initialize Strategy 

```sh
npx hardhat deploy-sushihodl-strategy --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```

- Verify Strategy:

```sh
npx hardhat verify-sushihodl-strategy --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```

## Post-Deployment Activities on Vaults

- set Strategy




- update TotalSupplyCap



## Post-Deployment Activities on Strategy





