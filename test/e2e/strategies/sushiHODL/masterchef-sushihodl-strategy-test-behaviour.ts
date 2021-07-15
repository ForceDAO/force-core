import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, Event, constants, Signer } from "ethers";
import { Interface, LogDescription } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { advanceTime, containsEvent } from "../../../helpers/util";
import { SUSHI_ADDRESS } from "../../../polygon-mainnet-fork-test-config";
import { StrategyTestData } from "./masterchef-sushihodl-strategy-testprep-helper";

const { AddressZero } = constants;

const ZERO = BigNumber.from(0);
const ONE_DAY = 86400;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;

const calculateMintedAmount = async (depositAmount: BigNumber, underlyingUnit: BigNumber, 
    underlyingBalanceWithInvestment: BigNumber, totalSupply: BigNumber): Promise<BigNumber> => {

       let  pricePerFullShare: BigNumber;

       if(totalSupply.eq(ZERO)){
            pricePerFullShare = underlyingUnit;
       }else{
            pricePerFullShare = (underlyingUnit.mul(underlyingBalanceWithInvestment)).div(totalSupply);
       }
      
    return depositAmount.mul(underlyingUnit).div(pricePerFullShare);
}

export async function sushiHodlBehavior(strategyTestData: () => Promise<StrategyTestData>) {

    describe("SushiHodl Behavior", async () => {

        let _depositAmount: BigNumber;
        let _depositAmountForSelf: BigNumber;
        let _depositAmountForBeneficiary: BigNumber;

        let _vaultInstance: Contract;
        let _storageInstance: Contract;
        
        let _underlyingInstance: Contract;
        
        let _strategyInstance: Contract;
        
        let _governanceSigner: SignerWithAddress;
        let _depositorSigner: SignerWithAddress;

        let _beneficiarySigner: SignerWithAddress;
        
        let _sushiTokenInstance: Contract;

        let _miniChefV2Instance: Contract;

        let _underlyingUnit: BigNumber;

        let _mockDepositor: Contract;

        let _txnReceipt: any;

        const hodlAndNotifyBehavior = async () => {
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
        }
        
        const exitRewardPoolBehavior = async () => {
            describe("When balance != 0", () => {
                let sushiInstance: Contract;
                let wmaticInstance: Contract;
                
                before(async () => {
                    sushiInstance = await ethers.getContractAt("IERC20", await _strategyInstance.sushiTokenAddress());
                    wmaticInstance = await ethers.getContractAt("IERC20", await _strategyInstance.wmaticTokenAddress());
                });

                describe("When claimAllowed", () => {
                    // it("should emit transfer event to strategy for sushi tokens", async () => {
                    //     await expectTxn.to.emit(sushiInstance, "Transfer").withArgs(miniChefV2Address, strategyAddress, depositAmount);
                    // });
                    it("should emit transfer event to strategy for wmatic tokens");
                    it("should emit transfer event to strategy for underlying tokens", async () => {

                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_miniChefV2Instance.address, _strategyInstance.address, _depositAmount]
                        ));
                        
                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_strategyInstance.address, _vaultInstance.address, _depositAmount]
                        ));

                    });
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
        
        const fixture = async () => {

            const { testAccounts, testStrategy, testVault }  = await strategyTestData();
            const { vaultAddress, underlying, storageAddress } = testVault;
            const { strategyAddress, miniChefV2 } = testStrategy;
            const { governanceSigner, depositorSigner, beneficiarySigner, mockDepositor } = testAccounts;
            const sushiAddress = SUSHI_ADDRESS;
                        
            const sushiTokenInstance = await ethers.getContractAt("IERC20", sushiAddress);
            const underlyingInstance = await ethers.getContractAt("IERC20", underlying);
            const vaultInstance = await ethers.getContractAt("Vault", vaultAddress);

            const strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
            const miniChefV2Instance = await ethers.getContractAt("IMiniChefV2", miniChefV2);
            const storageInstance = await ethers.getContractAt("Storage", storageAddress);

            const underlyingUnit = await vaultInstance.underlyingUnit();
            const depositAmount = await underlyingInstance.balanceOf(depositorSigner.address);
            await vaultInstance.setTotalSupplyCap(depositAmount);
            await vaultInstance.setWithdrawFee(0);

            const depositAmountForSelf = depositAmount.div(2);
            const depositAmountForBeneficiary = depositAmount.sub(depositAmountForSelf);

            return  {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                strategyInstance,
                miniChefV2Instance,
                underlyingInstance,
                vaultInstance,
                storageInstance,
                underlyingUnit,
                depositAmount,
                depositAmountForSelf,
                depositAmountForBeneficiary,
                mockDepositor
            };
        }

        before(async () => {
            const {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                strategyInstance,
                miniChefV2Instance,
                underlyingInstance,
                vaultInstance,
                storageInstance,
                underlyingUnit,
                depositAmount,
                depositAmountForSelf,
                depositAmountForBeneficiary,
                mockDepositor
            } = await fixture();

            _governanceSigner = governanceSigner;
            _depositorSigner = depositorSigner;
            _beneficiarySigner = beneficiarySigner;
            _sushiTokenInstance = sushiTokenInstance;
            _strategyInstance = strategyInstance;
            _miniChefV2Instance = miniChefV2Instance;
            _underlyingInstance = underlyingInstance;
            _vaultInstance = vaultInstance;
            _storageInstance = storageInstance;
            _underlyingUnit = underlyingUnit;
            _depositAmount = depositAmount;
            _depositAmountForSelf = depositAmountForSelf;
            _depositAmountForBeneficiary = depositAmountForBeneficiary;
            _mockDepositor = mockDepositor;
        });

        it("should have sell sushi and sell matic set to false as default", async () => {
            expect(await _strategyInstance.sellSushi()).to.be.false;
            expect(await _strategyInstance.sellWMatic()).to.be.false;
        });

        describe("Deposit", () => {
            describe("depositFor",  () => {

                let depositTxnReceipt: any;
                let expectedMintedAmount: BigNumber;

                before(async () => {
                    expectedMintedAmount = await calculateMintedAmount(
                        _depositAmountForBeneficiary,
                        _underlyingUnit,
                        ZERO,
                        ZERO);
                });
                
                it("should deposit underlying into vault", async () => {
                    await _underlyingInstance.connect(_depositorSigner).approve(_vaultInstance.address, _depositAmountForBeneficiary);
                    const balancePre = await _underlyingInstance.balanceOf(_depositorSigner.address);
    
                    depositTxnReceipt = await _vaultInstance.connect(_depositorSigner).depositFor(_depositAmountForBeneficiary, _beneficiarySigner.address);
                    depositTxnReceipt = await depositTxnReceipt.wait();
                    
                    const totalShares = await _vaultInstance.balanceOf(_beneficiarySigner.address);
    
                    expect(balancePre.sub(await _underlyingInstance.balanceOf(_depositorSigner.address))).to.be.equal(_depositAmountForBeneficiary);
                    expect(totalShares).to.be.equal(_depositAmountForBeneficiary);
                    expect(await _vaultInstance.getEstimatedWithdrawalAmount(totalShares)).to.be.equal(_depositAmountForBeneficiary);

                });

                it("should fail if beneficiary is address 0", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).depositFor(_depositAmountForBeneficiary, ethers.constants.AddressZero))
                                .to.be.revertedWith("holder must be defined");
                });
                
                it("should fail if amount is 0", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).deposit(0))
                        .to.be.revertedWith("Cannot deposit 0");
                });

                it("should fail if amount minted is higher than the totalSupplyCap", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).depositFor(_depositAmount.add(10), _beneficiarySigner.address))
                    .to.be.revertedWith("Cannot mint more than cap");
                });

                it("should fail if deposit and withdraw is in the same block", async () => {
                    await _storageInstance.addToWhiteList(_mockDepositor.address);
                    expect(await _storageInstance.whiteList(_mockDepositor.address)).to.be.true;

                    await expect(
                        _mockDepositor.connect(_depositorSigner).depositForAndWithdraw(
                            _beneficiarySigner.address,
                            _underlyingInstance.address, 
                            _vaultInstance.address, 
                            10)
                    ).to.be.revertedWith('withdraw: withdraw in same block not permitted');
                });

                it("should fail if not approved token", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).deposit(_depositAmountForBeneficiary)).to.be.revertedWith("ds-math-sub-underflow");
                });

                it("should emit mint event for receipt token", async () => {
                    expect(containsEvent(
                        depositTxnReceipt,
                        _vaultInstance,
                        "Transfer",
                        [AddressZero, _beneficiarySigner.address, expectedMintedAmount]
                    )).to.be.true;
                
                });
                
                it("should emit deposit event", async () => {

                    expect(containsEvent(
                        depositTxnReceipt,
                        _vaultInstance,
                        "Deposit",
                        [_beneficiarySigner.address, _depositAmountForBeneficiary]
                    )).to.be.true;
                });

                it("should emit transfer event for underlying", async () => {
                    expect(containsEvent(
                        depositTxnReceipt,
                        _underlyingInstance,
                        "Transfer",
                        [_depositorSigner.address, _vaultInstance.address, _depositAmountForBeneficiary]
                    )).to.be.true;
                });

                it("should mint expected amount of receipt token", async () => {
                    const mintedTokensForBeneficiary = await _vaultInstance.balanceOf(_beneficiarySigner.address);
                    expect(mintedTokensForBeneficiary).to.be.equal(expectedMintedAmount);
                });
            }); 
            
            describe("deposit (for self)", () => {

                let depositTxnReceipt: any;
                let expectedMintedAmount: BigNumber;

                before( async () => {
                    expectedMintedAmount = await calculateMintedAmount(
                        _depositAmountForSelf,
                        _underlyingUnit,
                        _depositAmountForBeneficiary,
                        _depositAmountForBeneficiary);
                });
      
                it("should fail if amount is 0", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).deposit(0)).to.be.revertedWith("Cannot deposit 0");
                });

                it("should fail if not approved token", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).deposit(_depositAmountForSelf)).to.be.revertedWith("ds-math-sub-underflow");
                });

                it("should deposit underlying into vault", async () => {
                    await _underlyingInstance.connect(_depositorSigner).approve(_vaultInstance.address, _depositAmountForSelf);
                    const balancePre = await _underlyingInstance.balanceOf(_depositorSigner.address);
    
                    depositTxnReceipt = await _vaultInstance.connect(_depositorSigner).deposit(_depositAmountForSelf);
                    depositTxnReceipt = await depositTxnReceipt.wait();

                    const totalShares = await _vaultInstance.balanceOf(_depositorSigner.address);
    
                    expect(balancePre.sub(await _underlyingInstance.balanceOf(_depositorSigner.address))).to.be.equal(_depositAmountForSelf);
                    expect(totalShares).to.be.equal(_depositAmountForSelf);
                    expect(await _vaultInstance.getEstimatedWithdrawalAmount(totalShares)).to.be.equal(_depositAmountForSelf);
                });

                it("should emit mint event for receipt token", async () => {
                    expect(containsEvent(
                        depositTxnReceipt,
                        _vaultInstance,
                        "Transfer",
                        [AddressZero, _depositorSigner.address, expectedMintedAmount]
                    )).to.be.true;
                });

                it("should emit deposit event", async () => {

                    expect(containsEvent(
                        depositTxnReceipt,
                        _vaultInstance,
                        "Deposit",
                        [_depositorSigner.address, _depositAmountForSelf]
                    )).to.be.true;
                });    

                it("should emit transfer event for underlying", async () => {
                    expect(containsEvent(
                        depositTxnReceipt,
                        _underlyingInstance,
                        "Transfer",
                        [_depositorSigner.address, _vaultInstance.address, _depositAmountForSelf]
                    )).to.be.true;
                });

                it("should mint expected amount of receipt token", async () => {
                    const mintedTokensForSelf = await _vaultInstance.balanceOf(_depositorSigner.address);
                    expect(mintedTokensForSelf).to.be.equal(expectedMintedAmount);
                });
            }); 

        });


        describe("Hardwork: Vault", () => {

            let vaultBalancePre: BigNumber;
            let vaultBalancePost: BigNumber;
            let miniChefBalancePre: BigNumber;
            let miniChefBalancePost: BigNumber;

            describe("When _withdrawBeforeReinvesting is false", () => {

                before(async () => {
                    vaultBalancePre = await _underlyingInstance.balanceOf(_vaultInstance.address);
                    expect(vaultBalancePre).to.be.equal(_depositAmount);
    
                    miniChefBalancePre = await _underlyingInstance.balanceOf(_miniChefV2Instance.address);
                    
                    _txnReceipt = await _vaultInstance.connect(_governanceSigner).doHardWork();
                    _txnReceipt = await _txnReceipt.wait();
                    
                    vaultBalancePost = await _underlyingInstance.balanceOf(_vaultInstance.address);
                });

                it("should move underlying from vault into strategy", async () => {
                    expect(await _underlyingInstance.balanceOf(_vaultInstance.address)).to.be.equal(ZERO);
                });
    
                it("should move underlying to MiniChef", async () => {
                    miniChefBalancePost = await _underlyingInstance.balanceOf(_miniChefV2Instance.address);
                    expect(miniChefBalancePost).to.be.equal(miniChefBalancePre.add(_depositAmount));
                });

                describe("When availableToInvestOut > 0", () => {
                    it("should emit Invest event");
                    it("should transfer amount availableToInvestOut to the strategy");
                });

                describe("When availableToInvestOut == 0", () => {
                    it("should not Invest event");
                    it("should not transfer amount availableToInvestOut to the strategy");
                });

                describe("Hardwork: Strategy", async () => {
    
                    describe("exitRewardPoolBehavior", exitRewardPoolBehavior);
                    describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);
                    
                    describe("investAllUnderlying", () => {
                        it("should call investAllUnderlying function");
                        it("should emit approve event for reward pool of 0");
                        it("should emit approve event for reward pool of entireBalance");
                        it("should emit transfer event for tokens from strategy to reward pool");
                        it("should emit Deposit event from reward pool");
                        it("should have the correct underlying balance in the strategy");
                        it("should have the correct user.amount and user.rewardDebt in the reward pool");
                    });
                });
            });
            
            describe("When _withdrawBeforeReinvesting is true", () => {
                it("should emit transfer event to the vault from strategy");
            });

            describe("Advance 1 Day", () => {

                before(async () => {
                    await _strategyInstance.setLiquidation(false, false, true);                        
                    await advanceTime(ONE_DAY);
                    await _vaultInstance.connect(_governanceSigner).doHardWork();
                });

                it("should leave sell flags as false", async () => {
                    expect(await _strategyInstance.sellSushi()).to.be.false;
                    expect(await _strategyInstance.sellWMatic()).to.be.false;
                });
                
                it("should set claim rewards", async () => {
                    expect(await _strategyInstance.claimAllowed()).to.be.true;
                });

            });

            
            describe("Advance 1 Day & Sell Rewards", async () => {
                before(async () => {
                    await _strategyInstance.setLiquidation(true, true, true);
                    await advanceTime(ONE_DAY);
                    await _vaultInstance.connect(_governanceSigner).doHardWork();
                });

                it("should set sell sushi and sell matic to true", async () => {
                    expect(await _strategyInstance.sellSushi()).to.be.true;
                    expect(await _strategyInstance.sellWMatic()).to.be.true;
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
                await _vaultInstance.connect(_governanceSigner).doHardWork();
            });

            describe("Without Fee", () => {
                it("should permit withdrawal of all underlying", async () => {
                    const vaultShares = await _vaultInstance.balanceOf(_depositorSigner.address);
                    await _vaultInstance.connect(_depositorSigner).withdraw(vaultShares);
    
                    expect(_depositAmountForSelf.lt(await _underlyingInstance.balanceOf(_depositorSigner.address))).to.be.true;
                    expect(await _vaultInstance.balanceOf(_depositorSigner.address)).to.be.equal(0);
                });

                it("should withdraw exact amount expected");
            });
            
            describe("With Fee", () => {
                it("should permit withdrawal of all underlying");
                it("should withdraw exact amount expected");
            });


        });

        describe("withdrawAll: Vault", async () => {

            before(async () => {
                // Deposit back into vault.
                await _underlyingInstance.connect(_depositorSigner).approve(_vaultInstance.address, _depositAmountForSelf);
                expect((await _underlyingInstance.balanceOf(_depositorSigner.address)).gt(_depositAmountForSelf));
                
                await _vaultInstance.connect(_depositorSigner).deposit(_depositAmountForSelf);
                expect(await _vaultInstance.balanceOf(_depositorSigner.address)).to.be.equal(_depositAmountForSelf);
                
                // Allow time for rewards.
                await advanceTime(ONE_DAY);
                
                // Confirm claim allowed.
                expect(await _strategyInstance.claimAllowed());
                
                // dohardwork to deposit back into strategy.
                await _vaultInstance.connect(_governanceSigner).doHardWork();
                expect(await _underlyingInstance.balanceOf(_vaultInstance.address)).to.be.equal(0);

                // Withdraw all back into vault.
                _txnReceipt = await _vaultInstance.connect(_governanceSigner).withdrawAll();
                _txnReceipt = await _txnReceipt.wait();

                expect(containsEvent(
                    _txnReceipt,
                    _underlyingInstance,
                    "Transfer",
                    [_miniChefV2Instance.address, _strategyInstance.address, _depositAmount]
                )).to.be.true;

            });

            it("should fail if called by non governance", async () => {
                await expect(_vaultInstance.connect(_depositorSigner).withdrawAll())
                    .to.be.revertedWith("The caller must be controller or governance");
            });

            it("should fail when strategy not defined");

            it("should succeed if called by controller");
            // it("should succeed if called by controller", async () => {
            //     await expect(vaultInstance.connect(controllerSigner).withdrawAll());
            // });

            describe("withdrawAllToVault: Strategy", async () => {

                describe("exitRewardPoolBehavior", exitRewardPoolBehavior);
                describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);

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