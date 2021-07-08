import { Logger } from "tslog";
import { StrategyTestData } from "./masterchef-sushihodl-strategy-testprep-helper";
const logger: Logger = new Logger();

export function executeTestBehavior(strategyTestData : StrategyTestData) {

    // compose the steps for Test Preparation

    /**
     * - Behavior to Test:

            - AddLiquidity to Pool and receive the LP Tokens
                - Assert for LP token Balance 
            - Approve Spending
            - Do deposit to vault
            - Do hardwork
            - advance time (1 week)
            - Do hardwork
      
        - Assertion of Test Output:

            - Assertion for hardwork:

                - events assertion
                - fees sent to controller
                - balance of the investor

            - Withdraw Assertion:
                - Withdrawn Amount should be more than Deposited Amount

            - events assertion
                - able to check the fee percentage
     */

    describe("behaviour test", () => {

        let vaultAddress = strategyTestData.testVault.vaultAddress;
    
        describe("deposit and doHardWork", async () => {
        
            // then fast forward 1 week
            // then: 
            it("should compound rewards after 1 week", async () => {
    
                // approve LP Spending for Vault, 
                // deposit into vault,
                // vault deposits into strategy
                // strategy deposits into MiniChef
    
            //approve for Vault
            
            await underlyingInstance.connect(depositorSigner).approve(vaultAddress, lpBalance);
            const lpAllowanceForVault = await underlyingInstance.connect(depositorSigner).allowance(depositor, vaultAddress);
    
            console.log(`\n--------------- BEFORE DEPOSIT --------------\n`)
    
            const lpBalanceOfDepositorBeforeDeposit : number = await underlyingInstance.balanceOf(depositor);
            console.log(`\nSLP-Balance of Depositor Before Deposit: ${lpBalanceOfDepositorBeforeDeposit}`);
            expect(lpBalanceOfDepositorBeforeDeposit).to.be.equal(lpBalance);
    
            const lpBalanceInVaultBeforeDeposit : number  = await underlyingInstance.balanceOf(vaultAddress);
            console.log(`SLP-Balance In Vault Before Deposit: ${lpBalanceInVaultBeforeDeposit}`);
    
            const VaultDeposittxResponse : any  = await vaultInstance.connect(depositorSigner).deposit(lpBalance);
            await VaultDeposittxResponse.wait();
            
            console.log(`\n--------------- AFTER DEPOSIT --------------\n`)
    
            const lpBalanceAfterDeposit : number  = await underlyingInstance.balanceOf(depositor);
            console.log(`SLP-Balance of Depositor After Deposit: ${lpBalanceAfterDeposit}`);
            expect(lpBalanceAfterDeposit).to.be.equal(0);
    
            const lpBalanceInVaultAfterDeposit : number  = await underlyingInstance.balanceOf(vaultAddress);
            console.log(`SLP-Balance In Vault After Deposit: ${lpBalanceInVaultAfterDeposit}`);
    
            const expectedVaultBalanceAfterDeposit : number = Number(lpBalanceOfDepositorBeforeDeposit) + Number(lpBalanceInVaultBeforeDeposit);
            expect(lpBalanceInVaultAfterDeposit).to.be.equal(expectedVaultBalanceAfterDeposit);
    
            const xlpBalanceAfterDeposit = await vaultInstance.balanceOf(depositor);
            console.log(`XLP-Balance of Depositor After Deposit is: ${xlpBalanceAfterDeposit}\n`);  
    
                const hardWorkTxResponse = await vaultInstance.connect(governanceSigner).doHardWork();
                await hardWorkTxResponse.wait();
    
            console.log(`\n--------------- HARD-WORK STARTS --------------\n`)
    
            const lpBalanceInVaultAfterFirstHardWork = await underlyingInstance.balanceOf(vaultAddress);
            console.log(`\nSLP-Balance In Vault After 1st HardWork: ${lpBalanceInVaultAfterFirstHardWork}`);
            expect(lpBalanceInVaultAfterFirstHardWork).to.be.equal(0);
    
                let xlpBalanceAfterHardwork = await vaultInstance.balanceOf(depositor);
    
            await ethers.provider.send("evm_increaseTime", [3600 * 24]);
            //await ethers.provider.send("evm_mine", []);
    
            const hardWorkTxResponse2 = await vaultInstance.connect(governanceSigner).doHardWork();
            await hardWorkTxResponse2.wait();
    
            const xlpBalanceAfterHardwork1 = await vaultInstance.balanceOf(depositor);
            console.log(`XLP-Balance Of Depositor After TimeAdvanced_Hardwork is: ${xlpBalanceAfterHardwork1} - ${typeof xlpBalanceAfterHardwork1}\n`);
    
            console.log(`\n--------------- HARD-WORK ENDS --------------\n`)
    
            const lpBalanceBeforeWithdraw = await underlyingInstance.balanceOf(depositor);
            console.log(`\nSLP-Balance of Depositor Before Withdraw: ${lpBalanceBeforeWithdraw}`);
    
            let xlpForWithdrawal = Number(xlpBalanceAfterHardwork1);
    
            console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING --------------\n`)
    
            const totalSupply = await vaultInstance.totalSupply();
            const withdrawFee = await vaultInstance.withdrawFee();
            const withdrawFeeShares = (Number(xlpForWithdrawal)*Number(withdrawFee))/(10 ** 18);
            console.log(`\nwithdrawFeeShares: ${withdrawFeeShares} computed using formula -> (XLP For Withdrawal: ${xlpForWithdrawal}) * (withdrawFee: ${withdrawFee}) / (10 ** 18)`);
    
            const numberOfSharesPostFee = Number(xlpForWithdrawal) - Number(withdrawFeeShares);
            console.log(`numberOfShares Post Fee: ${numberOfSharesPostFee} \n`);
    
            const calculatedSharePrice  = await vaultInstance.getPricePerFullShare();
            const underlyingUnit = await vaultInstance.underlyingUnit();
            const underlyingAmountToWithdraw = (Number(numberOfSharesPostFee) * Number(calculatedSharePrice))/underlyingUnit;
            console.log(`SLP To be Withdrawn to Depositor (Post Fee Deduction): ${underlyingAmountToWithdraw}`);
    
            let underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
    
            const lpBalanceOfStrategyBeforeWithdraw = await underlyingInstance.balanceOf(strategyAddress);
            console.log(`SLP-Balance Of Strategy Before Withdraw: ${lpBalanceOfStrategyBeforeWithdraw}`);
            
            console.log(`\nabout to withdraw: ${xlpForWithdrawal} from strategy to vault: ${vaultAddress}`);
    
            console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING ENDED --------------\n`)
    
            // const withdrawAllFromVaultTxn = await vaultInstance.connect(governanceSigner).withdrawAll();
            // await withdrawAllFromVaultTxn.wait();
    
            // underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
            // console.log(`SLP-Balance In Vault After withdrawAll: ${underlyingBalanceInVault}`);
    
            console.log(`\n--------------- WITHDRAW LOGGING --------------\n`)
    
            //74616502
            const withdrawTxnResponse = await vaultInstance.connect(depositorSigner).withdraw(xlpBalanceAfterHardwork1);
            await withdrawTxnResponse.wait();
    
            const lpBalanceAfterWithdraw = await underlyingInstance.balanceOf(depositor);
            console.log(`SLP-Balance of Depositor After Withdraw: ${lpBalanceAfterWithdraw} \n`);
            expect(Number(lpBalanceAfterWithdraw)).to.be.gt(Number(lpBalanceBeforeWithdraw));
    
            console.log(`\n--------------- WITHDRAW ENDED --------------\n`)
            });
    
        });
    
    });
}