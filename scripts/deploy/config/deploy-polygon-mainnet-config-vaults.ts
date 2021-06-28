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

export const vaults = {  
    "USDC-USDT": {
        vaultAddress: "0xcDE80036e5BA91d3cAF62ce83a4FF83bAf4f8738",
        vaultImplementationAddress: "0xB9786644eBE59749341Da925bBEC40E4C20c432F",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
