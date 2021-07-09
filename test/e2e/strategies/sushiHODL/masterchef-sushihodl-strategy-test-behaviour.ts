import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { StrategyTestData } from "./masterchef-sushihodl-strategy-testprep-helper";

const DEPOSIT_AMOUNT: BigNumber = BigNumber.from(50);
const WITHDRAW_AMOUNT: BigNumber = BigNumber.from(50);

const ZERO = BigNumber.from(0);
const ONE_DAY = 86400;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;
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
        let strategyInstance: any;
        
        let governanceSigner: any;
        let depositorSigner: any;

        let miniChefV2: string;
        
        before(async () => {
            const _strategyTestData = await strategyTestData();

            vaultAddress = _strategyTestData.testVault.vaultAddress;
            underlyingAddress = _strategyTestData.testVault.underlying;
            strategyAddress = _strategyTestData.testStrategy.strategyAddress;
            governanceSigner = _strategyTestData.testAccounts.governanceSigner;
            depositorSigner = _strategyTestData.testAccounts.depositorSigner;
            miniChefV2 = _strategyTestData.testStrategy.miniChefV2;
            
            underlyingInstance = await ethers.getContractAt("IERC20", underlyingAddress);
            vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
            strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);

            expect(underlyingInstance.address).to.be.equal(underlyingAddress);
            expect(underlyingInstance.address).to.be.equal(underlyingAddress);

        });

        it("should have sell sushi and sell matic set to false as default", async () => {
            expect(await strategyInstance.sellSushi()).to.be.false;
            expect(await strategyInstance.sellWMatic()).to.be.false;
        });

        describe("Deposit", async () => {
            
            it("should deposit underlying into vault", async () => {
                await underlyingInstance.connect(depositorSigner).approve(vaultAddress, DEPOSIT_AMOUNT);
                const balancePre = await underlyingInstance.balanceOf(depositorSigner.address);

                await vaultInstance.connect(depositorSigner).deposit(DEPOSIT_AMOUNT);

                expect(balancePre.sub(await underlyingInstance.balanceOf(depositorSigner.address))).to.be.equal(DEPOSIT_AMOUNT);
                expect(await vaultInstance.balanceOf(depositorSigner.address)).to.be.equal(DEPOSIT_AMOUNT);
            });

            describe("hardwork", async () => {

                let vaultBalancePre: BigNumber;
                let vaultBalancePost: BigNumber;
                let miniChefBalancePre: BigNumber;
                let miniChefBalancePost: BigNumber;
    
                before(async () => {
                    vaultBalancePre = await underlyingInstance.balanceOf(vaultAddress);
                    expect(vaultBalancePre).to.be.equal(DEPOSIT_AMOUNT);

                    miniChefBalancePre = await underlyingInstance.balanceOf(miniChefV2);
                    
                    await vaultInstance.connect(governanceSigner).doHardWork();
                    vaultBalancePost = await underlyingInstance.balanceOf(vaultAddress);
                });
    
                it("should move underlying from vault into strategy", async () => {
                    expect(await underlyingInstance.balanceOf(vaultAddress)).to.be.equal(ZERO);
                });
    
                it("should move underlying to MiniChef", async () => {
                    miniChefBalancePost = await underlyingInstance.balanceOf(miniChefV2);
                    expect(miniChefBalancePost).to.be.equal(miniChefBalancePre.add(DEPOSIT_AMOUNT));
                });
    
                
                describe("Advance 1 day", () => {

                    before(async () => {
                        await ethers.provider.send("evm_increaseTime", [ONE_DAY]);
                        await ethers.provider.send("evm_mine", []);
                        await vaultInstance.connect(governanceSigner).doHardWork(); 
                    });

                    it("should not auto-compound when sell flags are false", async () => {
                        expect(await strategyInstance.sellSushi()).to.be.false;
                        expect(await strategyInstance.sellWMatic()).to.be.false;
                        expect((await underlyingInstance.balanceOf(miniChefV2)).gt(miniChefBalancePost)).to.be.false;
                    });

                    describe("Advance 1 month & Sell Rewards", async () => {
                        before(async () => {
                            await strategyInstance.setLiquidation(true, true, true);
                            await ethers.provider.send("evm_increaseTime", [ONE_DAY]);
                            await ethers.provider.send("evm_mine", []);
                            await vaultInstance.connect(governanceSigner).doHardWork();
                        });

                        it("should set sell sushi and sell matic to true", async () => {
                            expect(await strategyInstance.sellSushi()).to.be.true;
                            expect(await strategyInstance.sellWMatic()).to.be.true;
                        });

                        it("should auto-compound rewards", async () => {
                            expect((await underlyingInstance.balanceOf(miniChefV2)).gt(miniChefBalancePost)).to.be.true;
                        });
                    });
                });
    
            });
    

        });


        // describe("withdraw from Vault to Depositor", async () => {

        //     it("should withdraw from Vault", async () => {

        //     });

        //     it("should fast forward 1 week", async () => {
        //         await ethers.provider.send("evm_increaseTime", [3600 * 24 * 10]);
        //         await ethers.provider.send("evm_mine", []);
        //     });
        
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