import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Logger } from "tslog";
const logger: Logger = new Logger();

export interface Strategy {
    strategyAddress: string;
    underlying: string;
    miniChefV2: string;
    mockDepositorAddress: string;
    complexRewarderTime: string;
}

export interface Vault {
    vaultAddress: string;
    underlying: string;
    uniFactory: string;
    toInvestNumerator: number;
    toInvestDenominator: number;
    totalSupplyCap: number;
    storageAddress: string;
}

export interface Accounts {
   governanceSigner: SignerWithAddress;
   controllerSigner: SignerWithAddress;
   depositorSigner: SignerWithAddress;
   beneficiarySigner: SignerWithAddress;
}

export interface StrategyTestData {
    Vault: Vault;
    Strategy: Strategy;
    Accounts: Accounts;
}

export interface UserInfo {
    amount: BigNumber;
    rewardDebt: BigNumber;
}

export function prepareForStrategyTest(strategyTestData : StrategyTestData) {

    //compose the steps for Test Preparation

    /**
     * - Test Setup
        - Impersonate the Governance Account used to deploy to mainnet
        - Deploy Storage, Vault,  Factory(transaction initiated from impersonated account)
        - create Strategy
        - set strategy to vault
        - set claimable, sellSushi, sellWmatic to true
        - Use the PoolAddress on the mainnet (injected to the function on the behavior)
     */

     /**
      * validate the Vault initialisation, validate the controller in storage
      */
}

export function impersonteAccounts(testAccountsForImpersonation : Accounts) {
      

}


export function deployStrategyFactoryForTest (governanceAddress : string) {
      
}

export function deployStrategyForTest (testStrategy : Strategy, governanceAddress : string) {
      
}

export function deployVaultForTest (vaultInit : Vault, governanceAddress : string) {

      
}





