export const network = "polygonmainnet";

export interface VaultData {
    [underlyingname: string] : Vault;
}

export interface Vault {
    vaultAddress: string;
    vaultImplementationAddress: string;
    vaultInit: VaultInit;
}

export interface VaultInit {
    underlying: string;
    toInvestNumerator: number;
    toInvestDenominator: number;
    totalSupplyCap: number;
}

export const vaults: VaultData = {  
    "USDC-USDT": {
        vaultAddress: "0xCa57C1d3c2c35E667745448Fef8407dd25487ff8",
        vaultImplementationAddress: "0xd0EC100F1252a53322051a95CF05c32f0C174354",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
