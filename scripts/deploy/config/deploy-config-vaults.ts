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
    totalSupplyCap: string;
}

export const vaults: VaultData = {
    "WMATIC-WETH": {
        vaultAddress: "0x7400DFCd9a001B15Affa0c5e2ED23C4fF25095A0",
        vaultImplementationAddress: "0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9",
        vaultInit: {
            underlying: "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: "155000000000000000000"
        }
    },
    "USDC-WETH": {
        vaultAddress: "0xA79dBa8DC71C9A646e991D02712437Ae7cCfbEeB",
        vaultImplementationAddress: "0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9",
        vaultInit: {
            underlying: "0x34965ba0ac2451A34a0471F04CCa3F990b8dea27",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: "162600000000000"
        }
    },
    "WETH-USDT": {
        vaultAddress: "0x705E15c2067643b9d4C9a03833B15b01fa758cE5",
        vaultImplementationAddress: "0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9",
        vaultInit: {
            underlying: "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: "172680000000000"
        }
    },    
    "WETH-DAI": {
        vaultAddress: "0x51eD427cf626344aB0eB9E4E5BdD4ADE5803ee1D",
        vaultImplementationAddress: "0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9",
        vaultInit: {
            underlying: "0x6FF62bfb8c12109E8000935A6De54daD83a4f39f",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: "167960000000000000000"
        }
    },
    "USDC-USDT": {
        vaultAddress: "0x127F52249fa07810a9c3937B3D2d3369859fF6Ab",
        vaultImplementationAddress: "0x25f68Fce1199b3C88a4F073D72E6c1E06736beE9",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: "9808000000"
        }
    }
} as VaultData;
