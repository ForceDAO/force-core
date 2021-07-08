import { Signer } from "ethers";
import { Logger } from "tslog";
const logger: Logger = new Logger();

export interface TestStrategy {
    strategyAddress: string;
    underlying: string;
}

export interface TestVault {
    vaultAddress: string;
    underlying: string;
    toInvestNumerator: number;
    toInvestDenominator: number;
    totalSupplyCap: number;
}

export interface TestAccounts {
   governanceSigner: Signer;
   controllerSigner: Signer;
   depositorSigner: Signer;
}

export interface StrategyTestData {
    testVault: TestVault;
    testStrategy: TestStrategy;
    testAccounts: TestAccounts;
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

export function impersonteAccounts(testAccountsForImpersonation : TestAccounts) {
      

}


export function deployStrategyFactoryForTest (governanceAddress : string) {
      
}

export function deployStrategyForTest (testStrategy : TestStrategy, governanceAddress : string) {
      
}

export function deployVaultForTest (vaultInit : TestVault, governanceAddress : string) {

      
}





