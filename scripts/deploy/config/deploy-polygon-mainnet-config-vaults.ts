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
        vaultAddress: "0xa0bCe1e38a2CAe963933c72Ea67B2B64fA712dD2",
        vaultImplementationAddress: "",
        vaultInit: {
            underlying: "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
            toInvestNumerator: 1000,
            toInvestDenominator: 1000,
            totalSupplyCap: 10
        }
    }
} as VaultData;
