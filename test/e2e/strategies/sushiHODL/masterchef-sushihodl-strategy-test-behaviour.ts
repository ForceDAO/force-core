import { expect } from "chai";
import { ethers } from "hardhat";
import { StrategyTestData } from "./masterchef-sushihodl-strategy-testprep-helper";

const { utils, BigNumber } = ethers;



const DEPOSIT_AMOUNT = BigNumber.from(100);
const WITHDRAW_AMOUNT = BigNumber.from(100);

export async function sushiHodlBehavior(strategyTestData: () => Promise<StrategyTestData>) {

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

    describe("SushiHodl Behavior", () => {
        let vaultAddress: any;
        let vaultInstance: any;
        
        let underlyingAddress: any;
        let underlyingInstance: any;
        
        let strategyAddress: any;
        
        let governanceAddress: any;
        let governanceSigner: any;
        
        let depositorAddress: any;
        let depositorSigner: any;
        
        
        before(async () => {
            const _strategyTestData = await strategyTestData();

            vaultAddress = _strategyTestData.testVault.vaultAddress;
            underlyingAddress = _strategyTestData.testVault.underlying;
            strategyAddress = _strategyTestData.testStrategy.strategyAddress;
            governanceAddress = _strategyTestData.testAccounts.governanceAddress;
            depositorAddress = _strategyTestData.testAccounts.depositorAddress;


            underlyingInstance = await ethers.getContractAt("IERC20", underlyingAddress);
            vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
            
            governanceSigner = ethers.getSigner(governanceAddress);
            depositorSigner = ethers.getSigner(depositorAddress);

            expect(underlyingInstance.address).to.be.equal(underlyingAddress);
            expect(underlyingInstance.address).to.be.equal(underlyingAddress);
            expect(governanceSigner.address).to.be.equal(governanceAddress);
            expect(depositorSigner.address).to.be.equal(depositorAddress);
        });

        describe("Deposit", async () => {
            
            it("should deposit underlying into vault", async () => {
                await underlyingInstance.connect(depositorSigner).approve(vaultAddress, DEPOSIT_AMOUNT);
                const balancePre = await underlyingInstance.balanceOf(depositorAddress);
                
                await vaultInstance.connect(depositorSigner).deposit(DEPOSIT_AMOUNT);

                expect((await underlyingInstance.balanceOf(depositorAddress)).sub(balancePre)).to.be.equal(DEPOSIT_AMOUNT);
                expect(await vaultInstance.balanceOf(depositorAddress)).to.be.equal(DEPOSIT_AMOUNT);
                
            });

        });

        // describe("hardwork", async () => {

        //     it("should do hardwork", async () => {

        //         const hardWorkTxResponse = await vaultInstance.connect(governanceSigner).doHardWork();
        //         await hardWorkTxResponse.wait();
                
        //         const lpBalanceInVaultAfterFirstHardWork = await underlyingInstance.balanceOf(vaultAddress);
        //         console.log(`\nSLP-Balance In Vault After 1st HardWork: ${lpBalanceInVaultAfterFirstHardWork}`);
        //         expect(lpBalanceInVaultAfterFirstHardWork).to.be.equal(0);
        
        //         let xlpBalanceAfterHardwork = await vaultInstance.balanceOf(depositorAddress);
        
        //         await ethers.provider.send("evm_increaseTime", [3600 * 24]);
        //         //await ethers.provider.send("evm_mine", []);
        
        //         const hardWorkTxResponse2 = await vaultInstance.connect(governanceSigner).doHardWork();
        //         await hardWorkTxResponse2.wait();
        
        //         const xlpBalanceAfterHardwork1 = await vaultInstance.balanceOf(depositorAddress);
        //         console.log(`XLP-Balance Of Depositor After TimeAdvanced_Hardwork is: ${xlpBalanceAfterHardwork1} - ${typeof xlpBalanceAfterHardwork1}\n`);
        
        //         console.log(`\n--------------- HARD-WORK ENDS --------------\n`)
        //     });

        // });

        // describe("withdraw from Vault to Depositor", async () => {
        
        //     // then fast forward 1 week
        //     // then: 
        //     it("should compound rewards after 1 week", async () => {
    
        
        //     const lpBalanceBeforeWithdraw = await underlyingInstance.balanceOf(depositorAddress);
        //     console.log(`\nSLP-Balance of Depositor Before Withdraw: ${lpBalanceBeforeWithdraw}`);
    
        //     let xlpForWithdrawal = Number(xlpBalanceAfterHardwork1);
    
        //     console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING --------------\n`)
    
        //     const totalSupply = await vaultInstance.totalSupply();
        //     const withdrawFee = await vaultInstance.withdrawFee();
        //     const withdrawFeeShares = (Number(xlpForWithdrawal)*Number(withdrawFee))/(10 ** 18);
        //     console.log(`\nwithdrawFeeShares: ${withdrawFeeShares} computed using formula -> (XLP For Withdrawal: ${xlpForWithdrawal}) * (withdrawFee: ${withdrawFee}) / (10 ** 18)`);
    
        //     const numberOfSharesPostFee = Number(xlpForWithdrawal) - Number(withdrawFeeShares);
        //     console.log(`numberOfShares Post Fee: ${numberOfSharesPostFee} \n`);
    
        //     const calculatedSharePrice  = await vaultInstance.getPricePerFullShare();
        //     const underlyingUnit = await vaultInstance.underlyingUnit();
        //     const underlyingAmountToWithdraw = (Number(numberOfSharesPostFee) * Number(calculatedSharePrice))/underlyingUnit;
        //     console.log(`SLP To be Withdrawn to Depositor (Post Fee Deduction): ${underlyingAmountToWithdraw}`);
    
        //     let underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
    
        //     const lpBalanceOfStrategyBeforeWithdraw = await underlyingInstance.balanceOf(strategyAddress);
        //     console.log(`SLP-Balance Of Strategy Before Withdraw: ${lpBalanceOfStrategyBeforeWithdraw}`);
            
        //     console.log(`\nabout to withdraw: ${xlpForWithdrawal} from strategy to vault: ${vaultAddress}`);
    
        //     console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING ENDED --------------\n`)
    
        //     // const withdrawAllFromVaultTxn = await vaultInstance.connect(governanceSigner).withdrawAll();
        //     // await withdrawAllFromVaultTxn.wait();
    
        //     // underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
        //     // console.log(`SLP-Balance In Vault After withdrawAll: ${underlyingBalanceInVault}`);
    
        //     console.log(`\n--------------- WITHDRAW LOGGING --------------\n`)
    
        //     //74616502
        //     const withdrawTxnResponse = await vaultInstance.connect(depositorSigner).withdraw(xlpBalanceAfterHardwork1);
        //     await withdrawTxnResponse.wait();
    
        //     const lpBalanceAfterWithdraw = await underlyingInstance.balanceOf(depositorAddress);
        //     console.log(`SLP-Balance of Depositor After Withdraw: ${lpBalanceAfterWithdraw} \n`);
        //     expect(Number(lpBalanceAfterWithdraw)).to.be.gt(Number(lpBalanceBeforeWithdraw));
    
        //     console.log(`\n--------------- WITHDRAW ENDED --------------\n`)
        //     });
    
        // });
    
    });
}