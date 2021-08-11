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

### WMATIC-WETH

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

### set Strategy

- WMATIC-WETH

```sh
 npx hardhat set-strategy --underlyingname WMATIC-WETH --strategyname SUSHIHODL-WMATIC-WETH-V1 --network polygonmainnet
```

- USDC-WETH

```sh
 npx hardhat set-strategy --underlyingname USDC-WETH --strategyname SUSHIHODL-USDC-WETH-V1 --network polygonmainnet
```

- WETH-USDT

```sh
 npx hardhat set-strategy --underlyingname WETH-USDT --strategyname SUSHIHODL-WETH-USDT-V1 --network polygonmainnet
```

- WETH-DAI

```sh
 npx hardhat set-strategy --underlyingname WETH-DAI --strategyname SUSHIHODL-WETH-DAI-V1 --network polygonmainnet
```

- USDC-USDT

```sh
 npx hardhat set-strategy --underlyingname USDC-USDT --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```


### update TotalSupplyCap

- WMATIC-WETH

```sh
 npx hardhat set-totalsupplycap --underlyingname WMATIC-WETH --totalsupplycap 155000000000000000000 --network polygonmainnet
```

- USDC-WETH

```sh
 npx hardhat set-totalsupplycap --underlyingname USDC-WETH --totalsupplycap 162600000000000 --network polygonmainnet
```

- WETH-USDT

```sh
 npx hardhat set-totalsupplycap --underlyingname WETH-USDT --totalsupplycap 172680000000000 --network polygonmainnet
```

- WETH-DAI

```sh
 npx hardhat set-totalsupplycap --underlyingname WETH-DAI --totalsupplycap 85730000000000000 --network polygonmainnet
```

- USDC-USDT

```sh
 npx hardhat set-totalsupplycap --underlyingname USDC-USDT --totalsupplycap 9808000000 --network polygonmainnet
```

### Set Controller

```sh
 npx hardhat set-controller --network polygonmainnet
```
### Set Governance

```sh
 npx hardhat set-governance --network polygonmainnet
```


### set-liquidation

- WMATIC-WETH

```sh
 npx hardhat set-liquidation --strategyname SUSHIHODL-WMATIC-WETH-V1 --network polygonmainnet
```

- USDC-WETH

```sh
 npx hardhat set-liquidation --strategyname SUSHIHODL-USDC-WETH-V1 --network polygonmainnet
```

- WETH-USDT

```sh
 npx hardhat set-liquidation --strategyname SUSHIHODL-WETH-USDT-V1 --network polygonmainnet
```

- WETH-DAI

```sh
 npx hardhat set-liquidation --strategyname SUSHIHODL-WETH-DAI-V1 --network polygonmainnet
```

- USDC-USDT

```sh
 npx hardhat set-liquidation --strategyname SUSHIHODL-USDC-USDT-V1 --network polygonmainnet
```

### Change Proxy Upgrade Admin

```sh
 npx hardhat transfer-proxy-admin-owner --proxyadmin 0xCE306b73cce8123FDEb5bDC40769955932b5Ed91 --newowner 0x98eB66A5482eC00800996c09109F3d651929F407 --network polygonmainnet
```

