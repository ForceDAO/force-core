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
        vaultAddress: "0x971b7D3AaC688340Abd3CeB740ea3F745A120df4",
        vaultImplementationAddress: "0xEc82c1077CFA5AFe921791CEEbA286b6085152df",
        vaultInit: {
            underlying: "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "USDC-WETH": {
        vaultAddress: "0xfc80b0f2a74fC4bBf7aFbFC85306535b9732BD9e",
        vaultImplementationAddress: "0xEc82c1077CFA5AFe921791CEE",
        vaultInit: {
            underlying: "0x34965ba0ac2451A34a0471F04CCa3F990b8dea27",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "WETH-USDT": {
        vaultAddress: "0x40bDFCA8d26d428E09ee5F5BBd1386c1A740F04d",
        vaultImplementationAddress: "0xEc82c1077CFA5AFe921791CEEbA286b6085152df",
        vaultInit: {
            underlying: "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },    
    "WETH-DAI": {
        vaultAddress: "0x43D91F76081339bf76CeA90A3743E30E7Dc9AEF7",
        vaultImplementationAddress: "0xEc82c1077CFA5AFe921791CEEbA286b6085152df",
        vaultInit: {
            underlying: "0x6FF62bfb8c12109E8000935A6De54daD83a4f39f",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    },
    "USDC-USDT": {
        vaultAddress: "0x8B5Ee8CA6b9a690f1dc0bfeA14a355A244307CDa",
        vaultImplementationAddress: "0xEc82c1077CFA5AFe921791CEEbA286b6085152df",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
