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
    "WMATIC-WETH": {
        vaultAddress: "0xD2ae88fA23B4cE9eA3b187E7f97c5AD191B79cce",
        vaultImplementationAddress: "0xd06B3080931611b53a7a1A1C0FeD9c2549eda169",
        vaultInit: {
            underlying: "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "USDC-WETH": {
        vaultAddress: "0xA6a82e1226a9838a0BBA82983F59fA60EFC7A495",
        vaultImplementationAddress: "0xd06B3080931611b53a7a1A1C0FeD9c2549eda169",
        vaultInit: {
            underlying: "0x34965ba0ac2451A34a0471F04CCa3F990b8dea27",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "WETH-USDT": {
        vaultAddress: "0x65480dd72d5ee4F0f80A1E7651D9b61D74eb1B54",
        vaultImplementationAddress: "0xd06B3080931611b53a7a1A1C0FeD9c2549eda169",
        vaultInit: {
            underlying: "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },    
    "WETH-DAI": {
        vaultAddress: "0xbbE43ff771E3ee65328C74731758d9E2327D6d3e",
        vaultImplementationAddress: "0xd06B3080931611b53a7a1A1C0FeD9c2549eda169",
        vaultInit: {
            underlying: "0x6FF62bfb8c12109E8000935A6De54daD83a4f39f",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "USDC-USDT": {
        vaultAddress: "0xBA256eA59255D6a0e1564749768536d00b8b002e",
        vaultImplementationAddress: "0xd06B3080931611b53a7a1A1C0FeD9c2549eda169",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
