import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, Event, constants, Signer } from "ethers";
import { Interface, LogDescription } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { HardhatNetworkForkingConfig, HardhatNetworkUserConfig } from "hardhat/types";

import { advanceTime, containsEvent } from "../../../helpers/util";
import { SUSHI_ADDRESS } from "../../../polygon-mainnet-fork-test-config";
import { StrategyTestData, UserInfo } from "./masterchef-sushihodl-strategy-testprep-helper";

require("dotenv").config();
const INFURA_POLYGON_MAINNET_KEY = process.env.INFURA_POLYGON_MAINNET_KEY || "";

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

        // Fresh state
        let _snapshotId: string;

        // GLobal Amounts
        let _depositAmount: BigNumber;
        let _depositAmountForSelf: BigNumber;
        let _depositAmountForBeneficiary: BigNumber;
        let _underlyingUnit: BigNumber;

        // Contract Instances
        let _vaultInstance: Contract;
        let _storageInstance: Contract;
        
        let _underlyingInstance: Contract;
        let _strategyInstance: Contract;
        let _sushiTokenInstance: Contract;
        let _miniChefV2Instance: Contract;
        let _rewarderInstance: Contract;

        // Signers
        let _governanceSigner: SignerWithAddress;
        let _depositorSigner: SignerWithAddress;
        let _beneficiarySigner: SignerWithAddress;

        let _mockDepositor: Contract;

        // GLobal scope transaction receipt
        let _txnReceipt: any;
        let _firstHardWorkTxnReceipt: any;

        // Pre-Balances tracking
        let _underlyingInVault: BigNumber;
        let _rewardDebtMinichef: BigNumber;
        let _amountInMinichef: BigNumber;
        let _sushiRewardAmount: BigNumber;
        let _rewarderReportedRewards: BigNumber;
        
        let _miniChefBalancePreDeposit: BigNumber;
        let _miniChefBalancePostDeposit: BigNumber;
        let token0Address: Address;
        let token1Address: Address;
        let token0Amount: BigNumber;
        let token1Amount: BigNumber;
        let rewardTokenAddress: Address;
        let rewardTokenBalance: BigNumber; 


        const hodlAndNotifyBehavior = async () => {
            describe("sellSushi", () => {
                before(async () => {


                    const {
                        governanceSigner,
                        depositorSigner,
                        beneficiarySigner,
                        sushiTokenInstance,
                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        storageInstance,
                        underlyingUnit,
                        depositAmount,
                        depositAmountForSelf,
                        depositAmountForBeneficiary,
                        mockDepositor,
                        miniChefBalancePreDeposit,
                        miniChefBalancePostDeposit,
                        rewardDebtMinichef,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards,
                        firstHardWorkTxnReceipt
                    } = await firstHardWorkFixture()




                    _governanceSigner = governanceSigner;
                    _depositorSigner = depositorSigner;
                    _beneficiarySigner = beneficiarySigner;
                    _sushiTokenInstance = sushiTokenInstance;
                    _strategyInstance = strategyInstance;
                    _miniChefV2Instance = miniChefV2Instance;
                    _rewarderInstance = rewarderInstance;
                    _underlyingInstance = underlyingInstance;
                    _vaultInstance = vaultInstance;
                    _storageInstance = storageInstance;
                    _underlyingUnit = underlyingUnit;
                    _depositAmount = depositAmount;
                    _depositAmountForSelf = depositAmountForSelf;
                    _depositAmountForBeneficiary = depositAmountForBeneficiary;
                    _mockDepositor = mockDepositor;
                    _miniChefBalancePreDeposit = miniChefBalancePreDeposit;
                    _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                    _rewardDebtMinichef = rewardDebtMinichef;
                    _amountInMinichef = amountInMinichef;
                    _sushiRewardAmount = sushiRewardAmount;
                    _rewarderReportedRewards = rewarderReportedRewards;
                    _firstHardWorkTxnReceipt = firstHardWorkTxnReceipt;

                });

                describe("rewardTokenBalance > minLiquidateTokens", () => {
                    before(async () => {
                        expect(await _strategyInstance.sellSushi()).to.be.true;

                    })
                    it("should have sell sushi set to true", async () => {
                        expect(await _strategyInstance.sellSushi()).to.be.true;
      
                    });
                    it("should emit approve amount for route of 0");
                    // expect(await _strategyInstance.sellWMatic()).to.be.false;
                       expect(containsEvent(
                        _txnReceipt,
                        _sushiTokenInstance,
                        "LogLiquidateRewardToken",
                        [rewardTokenAddress, token0Address, token1Address, rewardTokenBalance, token0Amount, token1Amount]
                        )).to.be.true; 
                        
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

                    before(async () => {
                        expect(await _strategyInstance.claimAllowed()).to.be.true;
                        expect(_amountInMinichef.gt(BigNumber.from("0"))).to.be.true;
                    });

                    it("should emit transfer event to strategy for sushi tokens", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            sushiInstance,
                            "Transfer",
                            [_miniChefV2Instance.address, _strategyInstance.address, _sushiRewardAmount]
                            )).to.be.true;
                        });
                        
                        it("should emit transfer event to strategy for wmatic tokens", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            wmaticInstance,
                            "Transfer",
                            [_rewarderInstance.address, _strategyInstance.address, _rewarderReportedRewards]
                        )).to.be.true;
                    });

                    it("should emit transfer event to strategy for underlying tokens", async () => {

                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_miniChefV2Instance.address, _strategyInstance.address, _depositAmount]
                        )).to.be.true;
                        
                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_strategyInstance.address, _vaultInstance.address, _depositAmount]
                        )).to.be.true;

                    });

                    it("should emit Withdraw event", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _miniChefV2Instance,
                            "Withdraw",
                            [_strategyInstance.address, await _strategyInstance.poolId(), _amountInMinichef, _strategyInstance.address]
                        )).to.be.true;
                    });

                    it("should emit Harvest event", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _miniChefV2Instance,
                            "Harvest",
                            [_strategyInstance.address, await _strategyInstance.poolId(), _sushiRewardAmount]
                        )).to.be.true;
                    });

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
            const { strategyAddress, miniChefV2, mockDepositorAddress, complexRewarderTime } = testStrategy;
            const { governanceSigner, depositorSigner, beneficiarySigner } = testAccounts;
            const sushiAddress = SUSHI_ADDRESS;

            const sushiTokenInstance = await ethers.getContractAt("IERC20", sushiAddress);
            const underlyingInstance = await ethers.getContractAt("IERC20", underlying);
            const vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
            const mockDepositor = await ethers.getContractAt("MockVaultDepositor", mockDepositorAddress);

            const strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
            const miniChefV2Instance = await ethers.getContractAt("IMiniChefV2", miniChefV2);
            const storageInstance = await ethers.getContractAt("Storage", storageAddress);
            const rewarderInstance = await ethers.getContractAt("IRewarder", complexRewarderTime);

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
                rewarderInstance,
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

        const firstHardWorkFixture = async () => {
            const [someSigner] = await ethers.getSigners();
            console.log(`reverting to ${_snapshotId}`)
            await network.provider.request({
                method: "evm_revert",
                params: [_snapshotId],
            });

            _snapshotId = (await network.provider.request({
                method: "evm_snapshot",
                params: [],
            })) as string;

            const {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                strategyInstance,
                miniChefV2Instance,
                rewarderInstance,
                underlyingInstance,
                vaultInstance,
                storageInstance,
                underlyingUnit,
                depositAmount,
                depositAmountForSelf,
                depositAmountForBeneficiary,
                mockDepositor
            } = await fixture();
            
            // Deposit into vault.
            await underlyingInstance.connect(depositorSigner).approve(vaultInstance.address, depositAmountForSelf);
            await vaultInstance.connect(depositorSigner).deposit(depositAmountForSelf);
            expect(await vaultInstance.balanceOf(depositorSigner.address)).to.be.equal(depositAmountForSelf);
            
            // Confirm claim allowed.
            await strategyInstance.setLiquidation(true, true, true);
            expect(await strategyInstance.claimAllowed());
            
            const miniChefBalancePreDeposit = await underlyingInstance.balanceOf(miniChefV2Instance.address);
            
            const underlyingBalanceBeforeHardWork = await _underlyingInstance.balanceOf(_vaultInstance.address);

            // dohardwork to deposit back into strategy.
            let firstHardWorkTxnReceipt = await vaultInstance.connect(governanceSigner).doHardWork();
            firstHardWorkTxnReceipt = await firstHardWorkTxnReceipt.wait();
            expect(await underlyingInstance.balanceOf(vaultInstance.address)).to.be.equal(0);

            // Allow time for rewards.
            await advanceTime(ONE_DAY);

            const miniChefBalancePostDeposit = await underlyingInstance.balanceOf(miniChefV2Instance.address);
            
            // Minichef Values.
            const { amount, rewardDebt } = await miniChefV2Instance.userInfo(await strategyInstance.poolId(), strategyInstance.address);
            const rewardDebtMinichef = rewardDebt;
            const amountInMinichef = amount;
            const sushiRewardAmount = await miniChefV2Instance.pendingSushi(await strategyInstance.poolId(), strategyInstance.address);

            // Rewarder (matic) Values.
            const [rewardAddress, rewards] = await rewarderInstance
                .pendingTokens(await strategyInstance.poolId(), strategyInstance.address, sushiRewardAmount);

            const rewarderReportedRewards = rewards[0];
            
            return {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                strategyInstance,
                miniChefV2Instance,
                rewarderInstance,
                underlyingInstance,
                vaultInstance,
                storageInstance,
                underlyingUnit,
                depositAmount,
                depositAmountForSelf,
                depositAmountForBeneficiary,
                mockDepositor,
                miniChefBalancePreDeposit,
                miniChefBalancePostDeposit,
                rewardDebtMinichef,
                amountInMinichef,
                sushiRewardAmount,
                rewarderReportedRewards,
                firstHardWorkTxnReceipt
            }
        }

        before(async () => {

            const snapshotId = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            const {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                strategyInstance,
                miniChefV2Instance,
                rewarderInstance,
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
            _rewarderInstance = rewarderInstance;
            _underlyingInstance = underlyingInstance;
            _vaultInstance = vaultInstance;
            _storageInstance = storageInstance;
            _underlyingUnit = underlyingUnit;
            _depositAmount = depositAmount;
            _depositAmountForSelf = depositAmountForSelf;
            _depositAmountForBeneficiary = depositAmountForBeneficiary;
            _mockDepositor = mockDepositor;
            _snapshotId = snapshotId as string;
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
                    await expect(_vaultInstance.connect(_depositorSigner).depositFor(
                        _depositAmount.add(10),
                        _beneficiarySigner.address))
                    .to.be.revertedWith("Cannot mint more than cap");
                });

                it("should fail if deposit and withdraw is in the same block", async () => {
                    await _storageInstance.addToWhiteList(_mockDepositor.address);
                    expect(await _storageInstance.whiteList(_mockDepositor.address)).to.be.true;

                    await _underlyingInstance.connect(_depositorSigner).approve(_mockDepositor.address, _depositAmountForSelf);

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

            let miniChefBalancePre: BigNumber;
            let miniChefBalancePost: BigNumber;

            describe("When _withdrawBeforeReinvesting is false", () => {

                let _miniChefBalancePreDeposit: BigNumber;
                let _miniChefBalancePostDeposit: BigNumber;

                before(async () => {

                    const {
                        governanceSigner,
                        depositorSigner,
                        beneficiarySigner,
                        sushiTokenInstance,
                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        storageInstance,
                        underlyingUnit,
                        depositAmount,
                        depositAmountForSelf,
                        depositAmountForBeneficiary,
                        mockDepositor,
                        miniChefBalancePreDeposit,
                        miniChefBalancePostDeposit,
                        rewardDebtMinichef,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards
                    } = await firstHardWorkFixture();
                    
                    _amountInMinichef = amountInMinichef;
                    _strategyInstance = strategyInstance;
                    _sushiRewardAmount = sushiRewardAmount;
                    _miniChefV2Instance = miniChefV2Instance;
                    _rewarderReportedRewards = rewarderReportedRewards;
                    _rewarderInstance = rewarderInstance;
                    _underlyingInstance = underlyingInstance;
                    _vaultInstance = vaultInstance;
                    _depositAmountForSelf = depositAmountForSelf;

                    const underlyingBalanceFirstHardWorkFixture = await _underlyingInstance.balanceOf(_vaultInstance.address);

                    _txnReceipt = await _vaultInstance.connect(_governanceSigner).doHardWork();
                    _txnReceipt = await _txnReceipt.wait();
                });

                it("should move underlying from vault into strategy", async () => {
                    const underlyingBalanceAfterHardWork = await _underlyingInstance.balanceOf(_vaultInstance.address);
                    expect(underlyingBalanceAfterHardWork).to.be.equal(ZERO);
                });
    
                it("should move underlying to MiniChef", async () => {
                    expect(_miniChefBalancePostDeposit).to.be.equal(_miniChefBalancePreDeposit.add(_depositAmountForSelf));
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

                let miniChefBalancePre: BigNumber;

                before(async () => {
                    const userInfo : UserInfo = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                    miniChefBalancePre = userInfo.amount;
                   await _strategyInstance.setLiquidation(true, true, true);
                   await advanceTime(ONE_DAY);
                   _txnReceipt = await _vaultInstance.connect(_governanceSigner).doHardWork();
                   _txnReceipt = await _txnReceipt.wait();
                });

                it("should set sell sushi and sell matic to true", async () => {
                    expect(await _strategyInstance.sellSushi()).to.be.true;
                    expect(await _strategyInstance.sellWMatic()).to.be.true;
                });

                it("should auto-compound rewards", async () => {
                    const {amount, rewardDebt} = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                    expect(amount.gt(miniChefBalancePre)).to.be.true;
                });
            });
        });


        describe("Withdraw", () => {

            before(async () => {

                const {
                    governanceSigner,
                    depositorSigner,
                    beneficiarySigner,
                    sushiTokenInstance,
                    strategyInstance,
                    miniChefV2Instance,
                    rewarderInstance,
                    underlyingInstance,
                    vaultInstance,
                    storageInstance,
                    underlyingUnit,
                    depositAmount,
                    depositAmountForSelf,
                    depositAmountForBeneficiary,
                    mockDepositor,
                    miniChefBalancePreDeposit,
                    miniChefBalancePostDeposit,
                    rewardDebtMinichef,
                    amountInMinichef,
                    sushiRewardAmount,
                    rewarderReportedRewards
                } = await firstHardWorkFixture();
                                   
                _amountInMinichef = amountInMinichef;
                _strategyInstance = strategyInstance;
                _sushiRewardAmount = sushiRewardAmount;
                _miniChefV2Instance = miniChefV2Instance;
                _rewarderReportedRewards = rewarderReportedRewards;
                _rewarderInstance = rewarderInstance;
                _underlyingInstance = underlyingInstance;
                _vaultInstance = vaultInstance;
                _depositAmountForSelf = depositAmountForSelf;

                await advanceTime(ONE_DAY);
                _txnReceipt = await _vaultInstance.connect(_governanceSigner).doHardWork();
                _txnReceipt = await _txnReceipt.wait();
            });

            describe("Without Fee", () => {

                let vaultShares: BigNumber;
                let underlyingBalanceofDepositorBeforeWithdraw: BigNumber;

                before( async () => {
                    const setZeroWithdrawFeeTxn = await _vaultInstance.connect(_governanceSigner).setWithdrawFee(0);
                    await setZeroWithdrawFeeTxn.wait();
                    underlyingBalanceofDepositorBeforeWithdraw = await _underlyingInstance.balanceOf(_depositorSigner.address);
                });

                it("should permit withdrawal of all underlying", async () => {
                    vaultShares = await _vaultInstance.balanceOf(_depositorSigner.address);
                    await _vaultInstance.connect(_depositorSigner).withdraw(vaultShares);
    
                    expect(_depositAmountForSelf.lt(await _underlyingInstance.balanceOf(_depositorSigner.address))).to.be.true;
                    expect(await _vaultInstance.balanceOf(_depositorSigner.address)).to.be.equal(0);
                });

                it("should withdraw exact amount expected", async () => {
                    const underlyingBalanceofDepositor = await _underlyingInstance.balanceOf(_depositorSigner.address);
                    expect(underlyingBalanceofDepositor).to.be.gt(_depositAmountForSelf);

                });
            });
            
            describe("With Fee", () => {

                before( async () => {
                    const setZeroWithdrawFeeTxn = await _vaultInstance.connect(_governanceSigner).setWithdrawFee(10);
                    await setZeroWithdrawFeeTxn.wait();
                });

                it("should permit withdrawal of all underlying");

                it("should withdraw exact amount expected");
            
            });
        });

        describe("withdrawAll: Vault", async () => {

            let vaultBalancePost: BigNumber;
            let miniChefBalancePre: BigNumber;
            let miniChefBalancePost: BigNumber;


            before(async () => {

                const {
                    governanceSigner,
                    depositorSigner,
                    beneficiarySigner,
                    sushiTokenInstance,
                    strategyInstance,
                    miniChefV2Instance,
                    rewarderInstance,
                    underlyingInstance,
                    vaultInstance,
                    storageInstance,
                    underlyingUnit,
                    depositAmount,
                    depositAmountForSelf,
                    depositAmountForBeneficiary,
                    mockDepositor,
                    miniChefBalancePreDeposit,
                    miniChefBalancePostDeposit,
                    rewardDebtMinichef,
                    amountInMinichef,
                    sushiRewardAmount,
                    rewarderReportedRewards
                } = await firstHardWorkFixture();
                                   
                _amountInMinichef = amountInMinichef;
                _strategyInstance = strategyInstance;
                _sushiRewardAmount = sushiRewardAmount;
                _miniChefV2Instance = miniChefV2Instance;
                _rewarderReportedRewards = rewarderReportedRewards;
                _rewarderInstance = rewarderInstance;
                _underlyingInstance = underlyingInstance;
                _vaultInstance = vaultInstance;
                _depositAmountForSelf = depositAmountForSelf;
                _governanceSigner = governanceSigner;

                _txnReceipt = await _vaultInstance.connect(_governanceSigner).doHardWork();
                _txnReceipt = await _txnReceipt.wait();
                
            });

            it("should fail if called by non governance", async () => {
                await expect(_vaultInstance.connect(_depositorSigner).withdrawAll())
                    .to.be.revertedWith("The caller must be controller or governance");
            });

            it("should fail when strategy not defined", async () => {
                const setInvalidStrategy = await _vaultInstance.connect(_governanceSigner).setStrategy("");
                await setInvalidStrategy.wait();
                await expect(_vaultInstance.connect(_depositorSigner).withdrawAll())
                    .to.be.revertedWith("");
            });

            it("should succeed if called by controller", async () => {
               await expect(_vaultInstance.connect(_governanceSigner).withdrawAll());                
            });

            describe("withdrawAllToVault: Strategy", async () => {

                let underlyingBalanceOfStrategyBeforeHodlAndNotify: BigNumber;
                let underlyingBalanceOfVaultBeforeHodlAndNotify: BigNumber;

                before( async () => {
                    underlyingBalanceOfStrategyBeforeHodlAndNotify = await _underlyingInstance.balanceOf(_strategyInstance.address);
                    underlyingBalanceOfVaultBeforeHodlAndNotify = await _underlyingInstance.balanceOf(_vaultInstance.address);
                });

                describe("exitRewardPoolBehavior", exitRewardPoolBehavior);
                describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);

                it("should update the correct user.amount and user.reward debt on the minichef contract", async () => {
                    const { amount, rewardDebt } = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                    expect(amount).to.be.equal(0);
                    expect(rewardDebt).to.be.equal(_rewardDebtMinichef.sub(_sushiRewardAmount));
                });

                it("should transfer underlying from strategy to vault", async () => {
                    const underlyingBalanceInStrategy = await _underlyingInstance.balanceOf(_strategyInstance.address);
                    expect(underlyingBalanceInStrategy).to.be.equal(0);
                    const underlyingBalanceInVault = await _underlyingInstance.balanceOf(_vaultInstance.address);
                    expect(underlyingBalanceInVault).to.be.equal(underlyingBalanceOfStrategyBeforeHodlAndNotify);
                });

                it("should emit transfer event to vault from strategy", async () => {

                    expect(containsEvent(
                        _txnReceipt,
                        _underlyingInstance,
                        "Transfer",
                        [_strategyInstance.address, _vaultInstance.address, _depositAmount]
                    )).to.be.true;
                });

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