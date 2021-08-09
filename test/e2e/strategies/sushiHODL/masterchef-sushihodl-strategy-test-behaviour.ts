import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, constants } from "ethers";
import { ethers, network } from "hardhat";

import { advanceTime, containsEvent, isWithin } from "../../../helpers/util";
import { SUSHI_ADDRESS } from "../../../polygon-mainnet-fork-test-config";
import { StrategyTestData, UserInfo } from "./masterchef-sushihodl-strategy-testprep-helper";

const { AddressZero } = constants;

const ZERO = BigNumber.from(0);
const ONE_DAY = 86400;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;

const calculateMintedAmount = async (depositAmount: BigNumber, underlyingUnit: BigNumber,
    underlyingBalanceWithInvestment: BigNumber, totalSupply: BigNumber): Promise<BigNumber> => {

    let pricePerFullShare: BigNumber;

    if (totalSupply.eq(ZERO)) {
        pricePerFullShare = underlyingUnit;
    } else {
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
        let _routerInstance: Contract;
        let _uniswapFactoryInstance: Contract;
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

        // Pre-Balances tracking
        let _underlyingInVault: BigNumber;
        let _rewardDebtMinichef: BigNumber;
        let _amountInMinichef: BigNumber;
        let _sushiRewardAmount: BigNumber;
        let _rewarderReportedRewards: BigNumber

        // Pre and post deposit balances
        let _miniChefBalancePreDeposit: BigNumber;
        let _miniChefBalancePostDeposit: BigNumber;

        const hodlAndNotifyBehavior = async () => {

            let sushiInstance: Contract;
            let wmaticInstance: Contract;
            let underlyingPair0Instance: Contract;
            let underlyingPair1Instance: Contract;
            let wMaticRoutes: string[];
            let sushiRoutes: string[][];

            before(async () => {
                sushiInstance = await ethers.getContractAt("IERC20", await _strategyInstance.sushiTokenAddress());
                wmaticInstance = await ethers.getContractAt("IERC20", await _strategyInstance.wmaticTokenAddress());
                sushiRoutes = await _strategyInstance.getSushiRoutes();
                underlyingPair0Instance = await ethers.getContractAt("IERC20", sushiRoutes[0][1]);
                underlyingPair1Instance = await ethers.getContractAt("IERC20",sushiRoutes[1][1]);
                wMaticRoutes = await _strategyInstance.getWmaticRoutes();
            });

            describe("sellSushi", () => {

                describe("verify Strategy Initialization", () => {
                    it("should have sell sushi set to be true", async () => {
                        expect(await _strategyInstance.sellSushi()).to.be.true;
                    });
                });

                describe("rewardTokenBalance > minLiquidateTokens", () => {

                    it("should emit sushi token approve amount for route of 0", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _sushiTokenInstance,
                            "Approval",
                            [_strategyInstance.address, await _strategyInstance.routerAddressV2(), 0]
                        )).to.be.true;
                    });

                    it("should emit sushi token approve amount for route of rewardTokenBalance", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _sushiTokenInstance,
                            "Approval",
                            [
                                _strategyInstance.address,
                                await _strategyInstance.routerAddressV2(),
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _sushiRewardAmount
                                )
                            ]
                        )).to.be.true;
                    });

                    describe("_uniswapPath0[0] != _uniswapPath0[1]", function () {
                        let uniPair: Contract;

                        before(async function () {
    
                            const pairAddress = await _uniswapFactoryInstance.getPair(sushiRoutes[0][0], sushiRoutes[0][1]);
                            uniPair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
                            
                            const condition = sushiRoutes[0][0] != sushiRoutes[0][1];
                            if (!(condition)) {
                                console.log("skipping sushi to sushi trade");
                                this.skip();  // <= skips entire describe
                            }
                        });

                        it("should emit transfer event of _uniswapPath0[1] token from Uni Pair to strategy", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                underlyingPair0Instance,
                                "Transfer",
                                [
                                    uniPair.address,
                                    _strategyInstance.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0))
                                ]
                            )).to.be.true;
                        });

                        it("should emit transfer event of _uniswapPath0[0] token from strategy to Uni Pair", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                sushiInstance,
                                "Transfer",
                                [
                                    _strategyInstance.address,
                                    uniPair.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0))
                                ]
                            )).to.be.true;
                        });

                        it("should emit swap event", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                uniPair,
                                "Swap",
                                [
                                    _routerInstance.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0)),
                                    0,
                                    0,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0)),
                                    _strategyInstance.address
                                ]
                            )).to.be.true;
                        });
                    });

                    describe("_uniswapPath1[0] != _uniswapPath1[1]", function () {
                        let uniPair: Contract;

                        before(async function () {
    
                            const pairAddress = await _uniswapFactoryInstance.getPair(sushiRoutes[1][0], sushiRoutes[1][1]);
                            uniPair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
                            
                            const condition = sushiRoutes[1][0] != sushiRoutes[1][1];
                            if (!(condition)) {
                                console.log("skipping sushi to sushi trade");
                                this.skip();  // <= skips entire describe
                            }
                        });

                        it("should emit transfer event of _uniswapPath1[1] token from Uni Pair to strategy", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                underlyingPair1Instance,
                                "Transfer",
                                [
                                    uniPair.address,
                                    _strategyInstance.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0))
                                ]
                            )).to.be.true;
                        });

                        it("should emit transfer event of _uniswapPath1[0] token from strategy to Uni Pair", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                sushiInstance,
                                "Transfer",
                                [
                                    _strategyInstance.address,
                                    uniPair.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0))
                                ]
                            )).to.be.true;
                        });

                        it("should emit swap event", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                uniPair,
                                "Swap",
                                [
                                    _routerInstance.address,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0)),
                                    0,
                                    0,
                                    (actual: BigNumber) => actual.gt(BigNumber.from(0)),
                                    _strategyInstance.address
                                ]
                            )).to.be.true;
                        });
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

                    describe("_uniswapPath0[0] != _uniswapPath0[1]", function () {
                        let uniPair: Contract;

                        before(async function () {
    
                            const pairAddress = await _uniswapFactoryInstance.getPair(wMaticRoutes[0][0], wMaticRoutes[0][1]);
                            uniPair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
                            
                            const condition = wMaticRoutes[0][0] != wMaticRoutes[0][1];
                            if (!(condition)) {
                                console.log("skipping wmatic to wmatic trade");
                                this.skip();  // <= skips entire describe
                            }
                        });

                        it("should emit transfer event to strategy", async () => {
                            expect(false).to.be.true;
                        });
                        it("should emit transfer event from strategy");
                        it("should emit swap event");
                    });

                    describe("_uniswapPath1[0] != _uniswapPath1[1]", function () {
                        let uniPair: Contract;

                        before(async function () {
    
                            const pairAddress = await _uniswapFactoryInstance.getPair(wMaticRoutes[1][0], wMaticRoutes[1][1]);
                            uniPair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
                            
                            const condition = wMaticRoutes[1][0] != wMaticRoutes[1][1];
                            if (!(condition)) {
                                console.log("skipping wmatic to wmatic trade");
                                this.skip();  // <= skips entire describe
                            }
                        });

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

        const exitRewardPoolBehaviorWhenClaimAllowed = async () => {
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
                            [
                                _miniChefV2Instance.address,
                                _strategyInstance.address,
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _sushiRewardAmount
                                )
                            ]
                        )).to.be.true;
                    });

                    it("should emit transfer event to strategy for wmatic tokens", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            wmaticInstance,
                            "Transfer",
                            [
                                _rewarderInstance.address,
                                _strategyInstance.address,
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _rewarderReportedRewards
                                )
                            ]
                        )).to.be.true;
                    });

                    it("should emit transfer event to strategy for underlying tokens", async () => {

                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_miniChefV2Instance.address, _strategyInstance.address, _depositAmountForSelf]
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
                            [
                                _strategyInstance.address,
                                await _strategyInstance.poolId(),
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _sushiRewardAmount
                                )
                            ]
                        )).to.be.true;
                    });

                });

            });

        }

        const exitRewardPoolBehaviorWhenClaimNotAllowed = async () => {
            describe("When balance != 0", () => {
                let wmaticInstance: Contract;

                before(async () => {
                    wmaticInstance = await ethers.getContractAt("IERC20", await _strategyInstance.wmaticTokenAddress());
                    expect(await _strategyInstance.claimAllowed()).to.be.false;
                });

                describe("When not claimAllowed", () => {
                    it("should emit transfer event to strategy for wmatic tokens", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            wmaticInstance,
                            "Transfer",
                            [
                                _rewarderInstance.address,
                                _strategyInstance.address,
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _rewarderReportedRewards
                                )
                            ]
                        )).to.be.true;
                    });

                    it("should emit transfer event to strategy for underlying tokens", async () => {

                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_miniChefV2Instance.address, _strategyInstance.address, _depositAmountForSelf]
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

                    it("should not emit Harvest event", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _miniChefV2Instance,
                            "Harvest",
                            [
                                _strategyInstance.address,
                                await _strategyInstance.poolId(),
                                (actual: BigNumber) => isWithin(
                                    // Acceptable Percent =/-
                                    ethers.utils.parseEther((0.001 / 100).toString()),
                                    actual,
                                    _sushiRewardAmount
                                )
                            ]
                        )).to.be.false;
                    });
                });

            });

        }

        const fixture = async () => {
            await network.provider.request({
                method: "evm_revert",
                params: [_snapshotId],
            });

            _snapshotId = (await network.provider.request({
                method: "evm_snapshot",
                params: [],
            })) as string;

            const { Accounts: testAccounts, Strategy: testStrategy, Vault: testVault } = await strategyTestData();
            const { vaultAddress, underlying, storageAddress, uniFactory } = testVault;
            const { strategyAddress, miniChefV2, mockDepositorAddress, complexRewarderTime } = testStrategy;
            const { governanceSigner, depositorSigner, beneficiarySigner } = testAccounts;
            const sushiAddress = SUSHI_ADDRESS;

            const sushiTokenInstance = await ethers.getContractAt("IERC20", sushiAddress);
            const underlyingInstance = await ethers.getContractAt("IUniswapV2Pair", underlying);
            const uniswapFactoryInstance = await ethers.getContractAt("IUniswapV2Factory", uniFactory);
            const vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
            const mockDepositor = await ethers.getContractAt("MockVaultDepositor", mockDepositorAddress);

            const strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
            const routerInstance = await ethers.getContractAt("IUniswapV2Router02", await strategyInstance.routerAddressV2());
            const miniChefV2Instance = await ethers.getContractAt("IMiniChefV2", miniChefV2);
            const storageInstance = await ethers.getContractAt("Storage", storageAddress);
            const rewarderInstance = await ethers.getContractAt("IRewarder", complexRewarderTime);

            const underlyingUnit = await vaultInstance.underlyingUnit();
            const depositAmount = await underlyingInstance.balanceOf(depositorSigner.address);
            await vaultInstance.setTotalSupplyCap(depositAmount);
            await vaultInstance.setWithdrawFee(0);

            const depositAmountForSelf = depositAmount.div(2);
            const depositAmountForBeneficiary = depositAmount.sub(depositAmountForSelf);

            return {
                governanceSigner,
                depositorSigner,
                beneficiarySigner,
                sushiTokenInstance,
                uniswapFactoryInstance,
                strategyInstance,
                routerInstance,
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

        const fixtureStrategySet = async (useFixture: Promise<any>) => {
            const instances = await useFixture;
            let { vaultInstance } = instances;

            // Set Strategy on Vault.
            const setStrategyTx = await vaultInstance.setStrategy(instances.strategyInstance.address);
            await setStrategyTx.wait();

            return { ...instances, vaultInstance };
        }

        const fixtureDeposit = async (useFixture: Promise<any>) => {
            const instances = await useFixture;

            let {
                vaultInstance,
                underlyingInstance,
                depositorSigner,
                depositAmountForSelf,
                miniChefV2Instance,
                strategyInstance
            } = instances;

            // Deposit into vault.
            await underlyingInstance.connect(depositorSigner).approve(vaultInstance.address, depositAmountForSelf);
            await vaultInstance.connect(depositorSigner).deposit(depositAmountForSelf);
            expect(await vaultInstance.balanceOf(depositorSigner.address)).to.be.equal(depositAmountForSelf);

            const { amount, rewardDebt } = await miniChefV2Instance.userInfo(await strategyInstance.poolId(), strategyInstance.address);
            const rewardDebtMinichef = rewardDebt;
            const amountInMinichef = amount;
            const sushiRewardAmount = await miniChefV2Instance.pendingSushi(await strategyInstance.poolId(), strategyInstance.address);

            return {
                ...instances,
                vaultInstance,
                underlyingInstance,
                rewardDebtMinichef,
                amountInMinichef,
                sushiRewardAmount
            };
        }

        const fixtureClaimable = async (useFixture: Promise<any>) => {
            const instances = await useFixture;

            let {
                strategyInstance
            } = instances;

            // Deposit into vault.
            // Confirm claim allowed.
            await strategyInstance.setLiquidation(true, true, true);
            expect(await strategyInstance.claimAllowed());

            return {
                ...instances,
                strategyInstance
            };
        }

        const firstHardWorkFixture = async (useFixture: Promise<any>) => {
            const instances = await useFixture;
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
            } = instances;

            const miniChefBalancePreDeposit = await underlyingInstance.balanceOf(miniChefV2Instance.address);

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
                ...instances,
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
        // Root Before Hook - Runs first
        before(async () => {

            const snapshotId = await network.provider.request({
                method: "evm_snapshot",
                params: [],
            });

            _snapshotId = snapshotId as string;

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
            } = await fixtureStrategySet(fixture());

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

        });

        it("should have sell sushi and sell matic set to false as default", async () => {
            expect(await _strategyInstance.sellSushi()).to.be.false;
            expect(await _strategyInstance.sellWMatic()).to.be.false;
        });

        describe("Deposit", () => {
            describe("depositFor", () => {

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

                before(async () => {
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

            let _miniChefBalancePreDeposit: BigNumber;
            let _miniChefBalancePostDeposit: BigNumber;

            describe("When _withdrawBeforeReinvesting is false", () => {

                before(async () => {

                    const {
                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        depositAmountForSelf,
                        miniChefBalancePreDeposit,
                        miniChefBalancePostDeposit,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards,
                        firstHardWorkTxnReceipt,
                        governanceSigner
                    } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

                    _governanceSigner = governanceSigner;
                    _amountInMinichef = amountInMinichef;
                    _strategyInstance = strategyInstance;
                    _sushiRewardAmount = sushiRewardAmount;
                    _miniChefV2Instance = miniChefV2Instance;
                    _rewarderReportedRewards = rewarderReportedRewards;
                    _rewarderInstance = rewarderInstance;
                    _underlyingInstance = underlyingInstance;
                    _vaultInstance = vaultInstance;
                    _depositAmountForSelf = depositAmountForSelf;
                    _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                    _miniChefBalancePreDeposit = miniChefBalancePreDeposit;
                    _txnReceipt = firstHardWorkTxnReceipt;

                    expect(await vaultInstance.withdrawBeforeReinvesting()).to.be.false;
                });

                it("should move underlying from vault into strategy", async () => {
                    const underlyingBalanceAfterHardWork = await _underlyingInstance.balanceOf(_vaultInstance.address);
                    expect(underlyingBalanceAfterHardWork).to.be.equal(ZERO);
                });

                it("should move underlying to MiniChef", async () => {
                    expect(_miniChefBalancePostDeposit).to.be.equal(_miniChefBalancePreDeposit.add(_depositAmountForSelf));
                });

                describe("When availableToInvestOut > 0", () => {

                    it("should emit Invest event", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _vaultInstance,
                            "Invest",
                            [_depositAmountForSelf]
                        )).to.be.true;
                    });

                    it("should emit transfer event of availableToInvestOut to the strategy", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_vaultInstance.address, _strategyInstance.address, _depositAmountForSelf]
                        )).to.be.true;
                    });

                });

                describe("When availableToInvestOut == 0", () => {

                    before(async () => {
                        _txnReceipt = await (await _vaultInstance.connect(_governanceSigner).doHardWork()).wait();
                    });

                    it("should not Invest event", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _vaultInstance,
                            "Invest",
                            [_depositAmountForSelf]
                        )).to.be.false;
                    });

                    it("should not transfer amount availableToInvestOut to the strategy", async () => {
                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_vaultInstance.address, _strategyInstance.address, _depositAmountForSelf]
                        )).to.be.false;
                    });
                });

                describe("Hardwork: Strategy", async () => {

                    before(async () => {

                        const {
                            strategyInstance,
                            miniChefV2Instance,
                            rewarderInstance,
                            underlyingInstance,
                            vaultInstance,
                            depositAmountForSelf,
                            miniChefBalancePreDeposit,
                            miniChefBalancePostDeposit,
                            amountInMinichef,
                            sushiRewardAmount,
                            rewarderReportedRewards,
                            firstHardWorkTxnReceipt,
                            governanceSigner
                        } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

                        _governanceSigner = governanceSigner;
                        _amountInMinichef = amountInMinichef;
                        _strategyInstance = strategyInstance;
                        _sushiRewardAmount = sushiRewardAmount;
                        _miniChefV2Instance = miniChefV2Instance;
                        _rewarderReportedRewards = rewarderReportedRewards;
                        _rewarderInstance = rewarderInstance;
                        _underlyingInstance = underlyingInstance;
                        _vaultInstance = vaultInstance;
                        _depositAmountForSelf = depositAmountForSelf;
                        _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                        _miniChefBalancePreDeposit = miniChefBalancePreDeposit;
                        _txnReceipt = firstHardWorkTxnReceipt;

                    });

                    describe("investAllUnderlying", () => {

                        it("should emit approve event for reward pool of 0", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                _underlyingInstance,
                                "Approval",
                                [_strategyInstance.address, await _strategyInstance.rewardPool(), 0]
                            )).to.be.true;
                        });

                        it("should emit approve event for reward pool of entireBalance", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                _underlyingInstance,
                                "Approval",
                                [_strategyInstance.address, await _strategyInstance.rewardPool(), _depositAmountForSelf]
                            )).to.be.true;
                        });

                        it("should emit transfer event for tokens from strategy to reward pool", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                _underlyingInstance,
                                "Transfer",
                                [_strategyInstance.address, await _strategyInstance.rewardPool(), _depositAmountForSelf]
                            )).to.be.true;
                        });

                        it("should emit Deposit event from reward pool", async () => {
                            expect(containsEvent(
                                _txnReceipt,
                                _miniChefV2Instance,
                                "Deposit",
                                [_strategyInstance.address, await _strategyInstance.poolId(), _depositAmountForSelf, _strategyInstance.address]
                            )).to.be.true;
                        });

                        it("should have the correct underlying balance in the strategy", async () => {
                            expect(await _underlyingInstance.balanceOf(_strategyInstance.address)).to.be.equal(0);
                        });

                        it("should have the correct user.amount and user.rewardDebt in the reward pool", async () => {
                            expect(_amountInMinichef).to.be.equal(_depositAmountForSelf);
                        });
                    });

                    describe("exitRewardPool & hodlAndNotify", () => {

                        describe("When Claim Allowed", () => {
                            before(async () => {

                                const {
                                    strategyInstance,
                                    routerInstance,
                                    miniChefV2Instance,
                                    rewarderInstance,
                                    underlyingInstance,
                                    vaultInstance,
                                    depositAmountForSelf,
                                    miniChefBalancePreDeposit,
                                    miniChefBalancePostDeposit,
                                    amountInMinichef,
                                    rewarderReportedRewards,
                                    firstHardWorkTxnReceipt,
                                    governanceSigner,
                                    uniswapFactoryInstance
                                } = await firstHardWorkFixture(fixtureClaimable(fixtureDeposit(fixtureStrategySet(fixture()))));

                                _uniswapFactoryInstance = uniswapFactoryInstance;
                                _strategyInstance = strategyInstance;
                                _routerInstance = routerInstance;
                                _miniChefV2Instance = miniChefV2Instance;
                                _rewarderInstance = rewarderInstance;
                                _underlyingInstance = underlyingInstance;
                                _vaultInstance = vaultInstance;
                                _depositAmountForSelf = depositAmountForSelf;
                                _miniChefBalancePreDeposit = miniChefBalancePreDeposit;
                                _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                                _amountInMinichef = amountInMinichef;
                                _rewarderReportedRewards = rewarderReportedRewards;
                                _txnReceipt = firstHardWorkTxnReceipt;
                                _governanceSigner = governanceSigner;

                                await advanceTime(ONE_DAY);
                                await _miniChefV2Instance.updatePool(await _strategyInstance.poolId());
                                await _rewarderInstance.updatePool(await _strategyInstance.poolId());
                                await ethers.provider.send("evm_mine", []);

                                _sushiRewardAmount = await _miniChefV2Instance.pendingSushi(await _strategyInstance.poolId(), _strategyInstance.address);

                                _rewarderReportedRewards = await _rewarderInstance.pendingToken(await _strategyInstance.poolId(), _strategyInstance.address);
                                _txnReceipt = await (await _vaultInstance.doHardWork()).wait();

                            });
                            describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);
                            describe("exitRewardPoolBehavior", exitRewardPoolBehaviorWhenClaimAllowed);

                        });

                        describe("When Claim Not Allowed", () => {
                            before(async () => {

                                const {
                                    strategyInstance,
                                    miniChefV2Instance,
                                    rewarderInstance,
                                    underlyingInstance,
                                    vaultInstance,
                                    depositAmountForSelf,
                                    miniChefBalancePreDeposit,
                                    miniChefBalancePostDeposit,
                                    amountInMinichef,
                                    rewarderReportedRewards,
                                    firstHardWorkTxnReceipt,
                                    governanceSigner
                                } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

                                _strategyInstance = strategyInstance;
                                _miniChefV2Instance = miniChefV2Instance;
                                _rewarderInstance = rewarderInstance;
                                _underlyingInstance = underlyingInstance;
                                _vaultInstance = vaultInstance;
                                _depositAmountForSelf = depositAmountForSelf;
                                _miniChefBalancePreDeposit = miniChefBalancePreDeposit;
                                _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                                _amountInMinichef = amountInMinichef;
                                _rewarderReportedRewards = rewarderReportedRewards;
                                _txnReceipt = firstHardWorkTxnReceipt;
                                _governanceSigner = governanceSigner;

                                await advanceTime(ONE_DAY);
                                await _miniChefV2Instance.updatePool(await _strategyInstance.poolId());
                                await _rewarderInstance.updatePool(await _strategyInstance.poolId());
                                await ethers.provider.send("evm_mine", []);

                                _sushiRewardAmount = await _miniChefV2Instance.pendingSushi(await _strategyInstance.poolId(), _strategyInstance.address);

                                _rewarderReportedRewards = await _rewarderInstance.pendingToken(await _strategyInstance.poolId(), _strategyInstance.address);
                                _txnReceipt = await (await _vaultInstance.doHardWork()).wait();
                            });

                            describe("exitRewardPoolBehavior", exitRewardPoolBehaviorWhenClaimNotAllowed);
                            // describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);
                        });

                    });

                });
            });

            describe("When _withdrawBeforeReinvesting is true", () => {

                before(async () => {

                    const {
                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        depositAmountForSelf,
                        miniChefBalancePreDeposit,
                        miniChefBalancePostDeposit,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards,
                        governanceSigner
                    } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

                    _governanceSigner = governanceSigner;
                    _amountInMinichef = amountInMinichef;
                    _strategyInstance = strategyInstance;
                    _sushiRewardAmount = sushiRewardAmount;
                    _miniChefV2Instance = miniChefV2Instance;
                    _rewarderReportedRewards = rewarderReportedRewards;
                    _rewarderInstance = rewarderInstance;
                    _underlyingInstance = underlyingInstance;
                    _vaultInstance = vaultInstance;
                    _depositAmountForSelf = depositAmountForSelf;
                    _miniChefBalancePostDeposit = miniChefBalancePostDeposit;
                    _miniChefBalancePreDeposit = miniChefBalancePreDeposit;

                    await vaultInstance.setWithdrawBeforeReinvesting(true);
                    await advanceTime(ONE_DAY);

                    const { amount } = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                    _amountInMinichef = amount;
                    _txnReceipt = await (await vaultInstance.doHardWork()).wait();
                    expect(await vaultInstance.withdrawBeforeReinvesting()).to.be.true;

                });

                it("should emit transfer event to the strategy from minichef", async () => {
                    expect(containsEvent(
                        _txnReceipt,
                        _underlyingInstance,
                        "Transfer",
                        [_miniChefV2Instance.address, _strategyInstance.address, _amountInMinichef]
                    )).to.be.true;
                });

                it("should emit transfer event to the vault from strategy", async () => {
                    expect(containsEvent(
                        _txnReceipt,
                        _underlyingInstance,
                        "Transfer",
                        [_strategyInstance.address, _vaultInstance.address, _amountInMinichef]
                    )).to.be.true;
                });
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
                    const userInfo: UserInfo = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
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
                    const { amount, rewardDebt } = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                    expect(amount.gt(miniChefBalancePre)).to.be.true;
                });
            });
        });


        describe("Withdraw", () => {

            describe("Without Fee", () => {

                before(async () => {

                    const {

                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        depositAmountForSelf,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards
                    } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

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

                    const setZeroWithdrawFeeTxn = await _vaultInstance.connect(_governanceSigner).setWithdrawFee(0);
                    await setZeroWithdrawFeeTxn.wait();
                });


                it("should permit withdrawal of expected amount of all underlying", async () => {

                    // Pre numbers.
                    const vaultShares = await _vaultInstance.balanceOf(_depositorSigner.address);
                    const underlyingBalanceSelf = await _underlyingInstance.balanceOf(_depositorSigner.address);

                    // Withdraw.
                    await _vaultInstance.connect(_depositorSigner).withdraw(vaultShares);

                    // Specs.
                    expect(_depositAmountForSelf.add(underlyingBalanceSelf)).to.be.equal(await _underlyingInstance.balanceOf(_depositorSigner.address));
                    expect(await _vaultInstance.balanceOf(_depositorSigner.address)).to.be.equal(0);
                });

            });

            describe("With Fee", () => {


                before(async () => {

                    const {

                        strategyInstance,
                        miniChefV2Instance,
                        rewarderInstance,
                        underlyingInstance,
                        vaultInstance,
                        depositAmountForSelf,
                        amountInMinichef,
                        sushiRewardAmount,
                        rewarderReportedRewards
                    } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

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

                    await (await _vaultInstance.connect(_governanceSigner).setWithdrawFee(10)).wait();
                });

                it("should permit withdrawal of expected amount of all underlying", async () => {

                    // Pre numbers.
                    const vaultShares = await _vaultInstance.balanceOf(_depositorSigner.address);
                    const underlyingBalanceSelf = await _underlyingInstance.balanceOf(_depositorSigner.address);

                    // Withdraw.
                    await _vaultInstance.connect(_depositorSigner).withdraw(vaultShares);

                    const fee = _depositAmountForSelf
                        .mul(await _vaultInstance.withdrawFee())
                        .div(await _vaultInstance.underlyingUnit());

                    // Specs.
                    expect(_depositAmountForSelf.add(underlyingBalanceSelf).sub(fee)).to.be.equal(await _underlyingInstance.balanceOf(_depositorSigner.address));
                    expect(await _vaultInstance.balanceOf(_depositorSigner.address)).to.be.equal(0);
                });

            });
        });

        describe("withdrawAll: Vault", async () => {

            describe("when strategy not defined", () => {
                let localVaultInstance: Contract;
                before(async () => {

                    const {
                        underlyingInstance,
                        depositorSigner,
                        beneficiarySigner,
                        vaultInstance,
                        governanceSigner,
                        depositAmountForBeneficiary
                    } = await fixture();

                    await underlyingInstance.connect(depositorSigner).approve(vaultInstance.address, depositAmountForBeneficiary);
                    await (await vaultInstance.connect(depositorSigner).depositFor(depositAmountForBeneficiary, beneficiarySigner.address)).wait();

                    localVaultInstance = vaultInstance;
                });

                it("should fail when strategy not defined", async () => {
                    await expect(localVaultInstance.withdrawAll())
                        .to.be.revertedWith("Strategy must be defined");
                });

            });

            describe("when strategy defined", () => {

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
                    } = await firstHardWorkFixture(fixtureDeposit(fixtureStrategySet(fixture())));

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
                    _rewardDebtMinichef = rewardDebtMinichef;

                    _txnReceipt = await _vaultInstance.connect(_governanceSigner).withdrawAll();
                    _txnReceipt = await _txnReceipt.wait();
                });

                it("should fail if called by non governance", async () => {
                    await expect(_vaultInstance.connect(_depositorSigner).withdrawAll())
                        .to.be.revertedWith("The caller must be controller or governance");
                });

                describe("withdrawAllToVault: Strategy", async () => {

                    // describe("exitRewardPoolBehavior", exitRewardPoolBehavior);
                    // describe("hodlAndNotifyBehavior", hodlAndNotifyBehavior);

                    it("should update the correct user.amount on the minichef contract", async () => {
                        const { amount, rewardDebt } = await _miniChefV2Instance.userInfo(await _strategyInstance.poolId(), _strategyInstance.address);
                        expect(amount).to.be.equal(0);
                    });

                    it("should transfer underlying from strategy to vault", async () => {
                        const underlyingBalanceInStrategy = await _underlyingInstance.balanceOf(_strategyInstance.address);
                        expect(underlyingBalanceInStrategy).to.be.equal(0);
                        const underlyingBalanceInVault = await _underlyingInstance.balanceOf(_vaultInstance.address);
                        expect(underlyingBalanceInVault).to.be.equal(_amountInMinichef);
                    });

                    it("should emit transfer event to vault from strategy", async () => {

                        expect(containsEvent(
                            _txnReceipt,
                            _underlyingInstance,
                            "Transfer",
                            [_strategyInstance.address, _vaultInstance.address, _depositAmountForSelf]
                        )).to.be.true;
                    });

                });

            });

        });

    });
}