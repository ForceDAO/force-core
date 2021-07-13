import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { any } from "hardhat/internal/core/params/argumentTypes";
import { advanceTime } from "../../../helpers/util";
import { SUSHI_ADDRESS, USDC_ADDRESS } from "../../../polygon-mainnet-fork-test-config";
import { StrategyTestData } from "./masterchef-sushihodl-strategy-testprep-helper";

const ZERO = BigNumber.from(0);
const ONE_DAY = 86400;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;

export async function hodlAndNotifyBehavior() {
    describe("_hodlAndNotify", () => {
        describe("sellSushi", () => {
            describe("rewardTokenBalance > minLiquidateTokens", () => {
                it("should emit approve amount for route of 0");
                it("should emit approve amount for route of rewardTokenBalance");
            
                describe("_uniswapPath0[0] != _uniswapPath0[1]", () => {
                    it("should swap tokens for _uniswapPath0[1]");
                    it("should emit transfer event to strategy");
                    it("should emit transfer event from strategy");
                    it("should emit swap event");
                });
                describe("_uniswapPath1[0] != _uniswapPath1[1]", () => {
                    it("should swap tokens for _uniswapPath1[1]");
                    it("should emit transfer event to strategy");
                    it("should emit transfer event from strategy");
                    it("should emit swap event");
                });

                describe("Add Liquidity", () => {
                    
                    describe("token0Address", () => {
                        it("should emit approve amount for router of 0");
                        it("should emit approve amount for router of token0Amount");
                    });

                    describe("token1Address", () => {
                        it("should emit approve amount for router of 0");
                        it("should emit approve amount for router of token0Amount");
                    });
                    
                    it("should log Mint event for correct underlying amount from the UniswapV2Pair");
                    it("should log LogLiquidityAdded event");
                });
            });
        });

        describe("sellWMatic", () => {
            describe("rewardTokenBalance > minLiquidateTokens", () => {
                it("should emit approve amount for route of 0");
                it("should emit approve amount for route of rewardTokenBalance");
            
                describe("_uniswapPath0[0] != _uniswapPath0[1]", () => {
                    it("should swap tokens for _uniswapPath0[1]");
                    it("should emit transfer event to strategy");
                    it("should emit transfer event from strategy");
                    it("should emit swap event");
                });
                describe("_uniswapPath1[0] != _uniswapPath1[1]", () => {
                    it("should swap tokens for _uniswapPath1[1]");
                    it("should emit transfer event to strategy");
                    it("should emit transfer event from strategy");
                    it("should emit swap event");
                });

                describe("Add Liquidity", () => {
                    
                    describe("token0Address", () => {
                        it("should emit approve amount for router of 0");
                        it("should emit approve amount for router of token0Amount");
                    });

                    describe("token1Address", () => {
                        it("should emit approve amount for router of 0");
                        it("should emit approve amount for router of token0Amount");
                    });
                    
                    it("should log Mint event for correct underlying amount from the UniswapV2Pair");
                    it("should log LogLiquidityAdded event");
                });
            });
        });

        describe("controller address set", () => {
            
            describe("fee > 0", () => {
                it("should emit transfer event of underlying to controller address");
                it("should transfer correct fee amount to controller address");
            });

            describe("fee == 0", () => {
                it("should not emit transfer event of underlying to controller address");
            });
            
        });
        
        
    });
}

export async function exitRewardPoolBehavior() {
    describe("When balance != 0", () => {

        describe("When claimAllowed", () => {
            it("should emit transfer event to strategy for sushi tokens");
            it("should emit transfer event to strategy for wmatic tokens");
            it("should emit transfer event to strategy for underlying tokens");
            it("should emit Withdraw event");
            it("should emit Harvest event");
            it("should update the correct user.amount and user.reward debt on the minichef contract");
        });

        describe("When not claimAllowed", () => {
            it("should emit transfer event to strategy for wmatic tokens");
            it("should emit transfer event to strategy for underlying tokens");
            it("should emit Withdraw event");
            it("should emit Harvest event");
            it("should update the correct user.amount and user.reward debt on the minichef contract");
        });
        
    });

    describe("When balance == 0", () => {
        
    });
}

export async function sushiHodlBehavior(strategyTestData: () => Promise<StrategyTestData>) {

    describe("SushiHodl Behavior", () => {

        let depositAmount: BigNumber;

        let vaultAddress: any;
        let vaultInstance: any;
        
        let underlyingAddress: any;
        let underlyingInstance: any;
        
        let strategyAddress: any;
        let strategyInstance: any;
        
        let governanceSigner: any;
        let depositorSigner: any;
        let depositorAddress: string;
        
        let sushiAddress: any;
        let sushiTokenInstance: any;

        let miniChefV2: string;
        
        before(async () => {
            const _strategyTestData = await strategyTestData();

            vaultAddress = _strategyTestData.testVault.vaultAddress;
            underlyingAddress = _strategyTestData.testVault.underlying;
            strategyAddress = _strategyTestData.testStrategy.strategyAddress;
            governanceSigner = _strategyTestData.testAccounts.governanceSigner;
            depositorSigner = _strategyTestData.testAccounts.depositorSigner;
            depositorAddress = depositorSigner.address;
            miniChefV2 = _strategyTestData.testStrategy.miniChefV2;
            sushiAddress = SUSHI_ADDRESS;
            sushiTokenInstance = await ethers.getContractAt("IERC20", sushiAddress);
            
            underlyingInstance = await ethers.getContractAt("IERC20", underlyingAddress);
            vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
            strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);

            depositAmount = await underlyingInstance.balanceOf(depositorSigner.address);
            await vaultInstance.setTotalSupplyCap(depositAmount);
            await vaultInstance.setWithdrawFee(0);
            
            expect(underlyingInstance.address).to.be.equal(underlyingAddress);
            expect(underlyingInstance.address).to.be.equal(underlyingAddress);
        });

        it("should have sell sushi and sell matic set to false as default", async () => {
            expect(await strategyInstance.sellSushi()).to.be.false;
            expect(await strategyInstance.sellWMatic()).to.be.false;
        });

        describe("Deposit", () => {
            describe("depositFor", () => {

                let depositEvent: any;
                let transferEvent: any;
                
                it("should deposit underlying into vault");
                it("should fail if beneficiary is address 0", async () => {
                    await expect(vaultInstance.connect(depositorSigner).depositFor(depositAmount, ethers.constants.AddressZero))
                                .to.be.revertedWith("holder must be defined");
                });
                
                it("should fail if amount is 0");

                it("should fail if not approved token", async () => {
                    await expect(vaultInstance.connect(depositorSigner).deposit(depositAmount)).to.be.revertedWith("ds-math-sub-underflow");
                });

                it("should emit mint event for receipt token");
                it("should emit deposit event");
                it("should emit transfer event for underlying");
                it("should mint expected amount of receipt token");

            }); 
            
            describe("deposit (for self)", () => {

                let depositEvent: any;
                let transferEvent: any;

                it("should fail if amount is 0", async () => {
                    await expect(vaultInstance.connect(depositorSigner).deposit(0)).to.be.revertedWith("Cannot deposit 0");
                });

                it("should fail if not approved token", async () => {
                    await expect(vaultInstance.connect(depositorSigner).deposit(depositAmount)).to.be.revertedWith("ds-math-sub-underflow");
                });

                it("should deposit underlying into vault", async () => {
                    await underlyingInstance.connect(depositorSigner).approve(vaultAddress, depositAmount);
                    const balancePre = await underlyingInstance.balanceOf(depositorSigner.address);
    
                    await vaultInstance.connect(depositorSigner).deposit(depositAmount);
                    const totalShares = await vaultInstance.balanceOf(depositorSigner.address);
    
                    expect(balancePre.sub(await underlyingInstance.balanceOf(depositorSigner.address))).to.be.equal(depositAmount);
                    expect(totalShares).to.be.equal(depositAmount);
                    expect(await vaultInstance.getEstimatedWithdrawalAmount(totalShares)).to.be.equal(depositAmount);

                    depositEvent = new Promise((resolve, reject) => {
                        vaultInstance.on(
                          "Deposit",
                          (
                            beneficiary : string,
                            amount : any,
                            event: any,
                          ) => {
                            event.removeListener();
                  
                            resolve({
                                beneficiary: beneficiary,
                                amount: amount,
                            });
                          },
                        );
                  
                        setTimeout(() => {
                          reject(new Error("timeout"));
                        }, 60000);
                    });

                    transferEvent =  new Promise((resolve, reject) => {
                        underlyingInstance.on(
                          "Transfer",
                          (
                            sender : string,
                            account : any,
                            amount : any,
                            event: any, 
                          ) => {
                            event.removeListener();
                  
                            resolve({

                                sender : sender, 
                                account : account,
                                amount: amount,
                            });
                          },
                        );
                  
                        setTimeout(() => {
                          reject(new Error("timeout"));
                        }, 60000);
                    });
                });

                it("should emit mint event for receipt token");

                it("should emit deposit event", async () => {

                    let event = await depositEvent;

                    const beneficiary = event.beneficiary;
                    expect(beneficiary).to.be.equal(depositorAddress);

                    const amount = event.amount;
                    expect(amount).to.be.equal(depositAmount);
                });    
                    

                it("should emit transfer event for underlying", async () => {
                    let event = await transferEvent;

                    const sender = event.sender;
                    expect(sender).to.be.equal(depositorAddress);

                    const amount = event.amount;
                    expect(amount).to.be.gt(0);

                    const account = event.account;
                    expect(account).to.be.equal(vaultAddress);
                });

                it("should mint expected amount of receipt token");
            }); 

        });


        describe("Hardwork: Vault", () => {

            let vaultBalancePre: BigNumber;
            let vaultBalancePost: BigNumber;
            let miniChefBalancePre: BigNumber;
            let miniChefBalancePost: BigNumber;
            let hardworkTxn;

            describe("When _withdrawBeforeReinvesting is false", () => {

                before(async () => {
                    vaultBalancePre = await underlyingInstance.balanceOf(vaultAddress);
                    expect(vaultBalancePre).to.be.equal(depositAmount);
    
                    miniChefBalancePre = await underlyingInstance.balanceOf(miniChefV2);
                    hardworkTxn = await vaultInstance.connect(governanceSigner).doHardWork();
                    vaultBalancePost = await underlyingInstance.balanceOf(vaultAddress);
                });

                it("should move underlying from vault into strategy", async () => {
                    expect(await underlyingInstance.balanceOf(vaultAddress)).to.be.equal(ZERO);
                });
    
                it("should move underlying to MiniChef", async () => {
                    miniChefBalancePost = await underlyingInstance.balanceOf(miniChefV2);
                    expect(miniChefBalancePost).to.be.equal(miniChefBalancePre.add(depositAmount));
                });

                describe("When availableToInvestOut > 0", () => {
                    it("should emit Invest event");
                    it("should transfer amount availableToInvestOut to the strategy");
                });

                describe("When availableToInvestOut == 0", () => {
                    it("should not Invest event");
                    it("should not transfer amount availableToInvestOut to the strategy");
                });

            });
            
            describe("When _withdrawBeforeReinvesting is true", () => {
                it("should emit transfer event to the vault from strategy");
            });


            describe("Hardwork: Strategy", async () => {

                await exitRewardPoolBehavior();
                
                await hodlAndNotifyBehavior();
                
                describe("investAllUnderlying", () => {
                    it("should emit approve event for reward pool of 0");
                    it("should emit approve event for reward pool of entireBalance");
                    it("should emit transfer event for tokens from strategy to reward pool");
                    it("should emit Deposit event from reward pool");
                    it("should have the correct underlying balance in the strategy");
                    it("should have the correct user.amount and user.rewardDebt in the reward pool");
                });
            });


            describe("Advance 1 Day", () => {

                before(async () => {
                    await strategyInstance.setLiquidation(false, false, true);                        
                    await advanceTime(ONE_DAY);
                    await vaultInstance.connect(governanceSigner).doHardWork();
                });

                it("should leave sell flags as false", async () => {
                    expect(await strategyInstance.sellSushi()).to.be.false;
                    expect(await strategyInstance.sellWMatic()).to.be.false;
                });
                
                it("should set claim rewards", async () => {
                    expect(await strategyInstance.claimAllowed()).to.be.true;
                });

            });

            
            describe("Advance 1 Day & Sell Rewards", async () => {
                before(async () => {
                    await strategyInstance.setLiquidation(true, true, true);
                    await advanceTime(ONE_DAY);
                    await vaultInstance.connect(governanceSigner).doHardWork();
                });

                it("should set sell sushi and sell matic to true", async () => {
                    expect(await strategyInstance.sellSushi()).to.be.true;
                    expect(await strategyInstance.sellWMatic()).to.be.true;
                });

                it("should auto-compound rewards");
                // it("should auto-compound rewards", async () => {
                //     const underlyingBalanceAfterAutoC = await underlyingInstance.balanceOf(miniChefV2);
                //     console.log(`underlyingBalanceAfterAutoC is: ${underlyingBalanceAfterAutoC}`);
                //     expect((await underlyingInstance.balanceOf(miniChefV2)).gt(miniChefBalancePost)).to.be.true;
                // });
            });
        });


        describe("Withdraw", () => {

            before(async () => {                     
                await advanceTime(ONE_DAY);
                await vaultInstance.connect(governanceSigner).doHardWork();
            });

            describe("Without Fee", () => {
                it("should permit withdrawal of all underlying", async () => {
                    const vaultShares = await vaultInstance.balanceOf(depositorSigner.address);
    
                    console.log(`ts depositAmount: ${depositAmount.toString()}`);
                    console.log(`ts vaultShares: ${vaultShares.toString()}`);
                    console.log(`ts getEstimatedWithdrawalAmount: ${(await vaultInstance.getEstimatedWithdrawalAmount(vaultShares)).toString()}`);
                    console.log(`ts getPricePerFullShare: ${(await vaultInstance.getPricePerFullShare()).toString()}`);
                    await vaultInstance.connect(depositorSigner).withdraw(vaultShares);
    
                    console.log(`ts balance after ${await underlyingInstance.balanceOf(depositorSigner.address)}`);
                    expect(depositAmount.lt(await underlyingInstance.balanceOf(depositorSigner.address))).to.be.true;
                    expect(await vaultInstance.balanceOf(depositorSigner.address)).to.be.equal(0);
                });

                it("should withdraw exact amount expected");
            });
            
            describe("With Fee", () => {
                it("should permit withdrawal of all underlying");
                it("should withdraw exact amount expected");
            });


        });

        describe("withdrawAll: Vault", () => {

            it("should fail if called by non governance");
            it("should fail when strategy not defined");
            it("should succeed if called by controller");
            it("should succeed if called by governance");

            describe("withdrawAllToVault: Strategy", async () => {
                await exitRewardPoolBehavior();

                await hodlAndNotifyBehavior();

                it("should transfer underlying from strategy to vault");
                it("should emit transfer event to vault from strategy");
            });
        });

        // describe("withdraw from Vault to Depositor", async () => {

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