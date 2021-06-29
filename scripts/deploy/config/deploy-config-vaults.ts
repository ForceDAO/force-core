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
        vaultAddress: "0xD8491D3C6746F58d94aE09D45AD3e12639637aA4",
        vaultImplementationAddress: "0xb9786644ebe59749341da925bbec40e4c20c432f",
        vaultInit: {
            underlying: "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "USDC-WETH": {
        vaultAddress: "",
        vaultImplementationAddress: "",
        vaultInit: {
            underlying: "0x34965ba0ac2451A34a0471F04CCa3F990b8dea27",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "WETH-USDT": {
        vaultAddress: "",
        vaultImplementationAddress: "",
        vaultInit: {
            underlying: "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },    
    "WETH-DAI": {
        vaultAddress: "",
        vaultImplementationAddress: "",
        vaultInit: {
            underlying: "0x6FF62bfb8c12109E8000935A6De54daD83a4f39f",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },       
    "USDC-USDT": {
        vaultAddress: "",
        vaultImplementationAddress: "",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
