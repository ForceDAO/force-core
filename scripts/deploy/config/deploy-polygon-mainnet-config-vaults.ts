export const deployConfigVaults = {  
    network : "polygonmainnet",
    vaults: {
        "USDC-USDT": {
            vaultAddress: "0x8D7f8722B796526B7DBe94055cb405148cc47719",
            vaultInit: {
                underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
                toInvestNumerator: 1000,
                toInvestDenominator: 1000,
                totalSupplyCap: 10
            }
        },
    }
}

export default deployConfigVaults;