const { expectRevert, constants, time } = require("@openzeppelin/test-helpers");
const Vault = artifacts.require("Vault");
const Controller = artifacts.require("Controller");
const MockToken = artifacts.require("MockToken");
const NoopStrategy = artifacts.require("NoopStrategyV2");
const LossStrategy = artifacts.require("LossStrategyV2");
const ProfitStrategy = artifacts.require("ProfitStrategyV2");
const MockGreyListed = artifacts.require("MockGreyListed");
const Storage = artifacts.require("Storage");
const MockUSDC = artifacts.require("MockUSDC");
const VaultUpgradableSooner = artifacts.require("VaultUpgradableSooner");
const InterestEarningStrategy = artifacts.require("InterestEarningStrategy");
const BigNumberJs = require("bignumber.js");
BigNumberJs.config({ DECIMAL_PLACES: 0 });
const {timeForwardInSec, getBlockTimestamp, getBlockTimestampBN, getEventArgs, } = require("./Utils.js");
//-----------------==

const { BigNumber } = require("ethers");
//const log1 = console.log;
let signer0, signer1, signer2, signer3, signer4, addrs, tx, t1, t2, t3, receipt, eventArg0, eventArg1, eventArg2, eventArg3, args, strategy1, strategy2, strategy3, strategy4, strategyUpdateTime, futureStrategy, strategyTimeLock, canUpdateStrategy;

contract("Vault Test", function (accounts) {
  describe("Deposit and Withdraw", function () {
    let governance = accounts[0];
    let controller = accounts[1];
    let farmer = accounts[2];
    let strategy = accounts[3];
    let farmerBob = accounts[4];
    let burner = accounts[9];

    let storage;
    let vault;
    let underlying, underlying2;

    const tokenUnit = "1000000000000000000";
    const farmerBalance = "95848503450";
    const underlyingSymbol = "MOCK";
    const roundBalance = "1000000";
    const roundBalancePostLoss = "900000";
    const roundBalancePostGain = "1100000";
    const roundBalancePostGainFarmer = "1152381";
    const roundBalancePostGainFarmerBob =
      2 * roundBalancePostGain - roundBalancePostGainFarmer;

    let underlyingDecimals = "18";
    const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
    const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);

    //const { ethers, upgrades } = require("hardhat");
    const makeVault = async (toInvestNumerator =100, toInvestDenominator = 100) => {
      const VaultFactory = await ethers.getContractFactory("Vault");
      const vault = await upgrades.deployProxy(VaultFactory, [storage.address, underlying.address, toInvestNumerator, toInvestDenominator, totalSupplyCap], {initializer: 'initializeVault(address,address,uint256,uint256,uint256)', unsafeAllow: ['constructor'], unsafeAllowCustomTypes: true, from: governance});
      return vault;
    }
    beforeEach(async function () {
      [signer0, signer1, signer2, signer3, signer4, ...addrs] = await hre.ethers.getSigners();

      storage = await Storage.new({ from: governance });
      await storage.setController(controller, { from: governance });
      // create the underlying token
      underlying = await MockToken.new({ from: governance });
      await underlying.mint(farmer, farmerBalance, { from: governance });
      assert.equal(
        farmerBalance,
        (await underlying.balanceOf(farmer)).toString()
      );
      vault = await makeVault();
      //console.log("vault", vault.address)
      // set up the strategy

      //console.log("check 1")
      await expectRevert(
        vault.setStrategy(constants.ZERO_ADDRESS),
        "new _strategy cannot be empty"
      );
      //console.log("check 2")
      await expectRevert(
        vault.doHardWork(),
        "Strategy must be defined"
      );

      strategy = await NoopStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );
      await vault.connect(signer1).setStrategy(strategy.address);
      assert.equal(strategy.address, await vault.strategy());
    });

    it('Vault name should have "FORCE" prefix', async () => {
      const vaultTokenName = await vault.name();
      assert.equal(vaultTokenName, `FORCE_${underlyingSymbol}`);
    });

    it('Vault symbol should have "x" prefix', async () => {
      const vaultTokenSymbol = await vault.symbol();
      assert.equal(vaultTokenSymbol, `x${underlyingSymbol}`);
    });

    it("empty vault", async function () {
      // set up the vault with 100% investment
      vault = await makeVault();
      assert.equal("0", await vault.underlyingBalanceWithInvestment());
      await underlying.mint(vault.address, farmerBalance, { from: governance });
      
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestment()
      );
    });
    it("Update Functions", async function () {
      console.log("\n-------== announceStrategyUpdate");
      strategyTimeLock = await vault.strategyTimeLock();
      strategyUpdateTime = await vault.strategyUpdateTime();
      futureStrategy = await vault.futureStrategy();
      console.log("strategyUpdateTime:", strategyUpdateTime.toString(), "\nfutureStrategy:", futureStrategy);

      canUpdateStrategy = await vault.canUpdateStrategy(signer1.address);
      console.log("canUpdateStrategy:", canUpdateStrategy);

      tx = await vault.announceStrategyUpdate(signer1.address);
      receipt = await tx.wait();
      t1 = await getBlockTimestampBN();
      args = getEventArgs(receipt, "StrategyAnnounced");
      //console.log("StrategyAnnounced arg:",args);
      expect(args[0]).to.equal(signer1.address);

      console.log("check 10. t1:", t1.toString());
      const when = t1.add(strategyTimeLock);
      expect(args[1]).to.equal(when);
      expect(await vault.strategyUpdateTime()).to.equal(when);

      strategyUpdateTime = await vault.strategyUpdateTime();
      futureStrategy = await vault.futureStrategy();
      console.log("\nstrategyUpdateTime:", strategyUpdateTime.toString(), "\nfutureStrategy:", futureStrategy);
      canUpdateStrategy = await vault.canUpdateStrategy(signer1.address);
      console.log("canUpdateStrategy:", canUpdateStrategy);

      console.log("\n-------== finalizeStrategyUpdate");
      await vault.finalizeStrategyUpdate();
      expect(await vault.strategyUpdateTime()).to.equal(0);
      expect(await vault.futureStrategy()).to.equal(constants.ZERO_ADDRESS);
      strategyUpdateTime = await vault.strategyUpdateTime();
      futureStrategy = await vault.futureStrategy();
      console.log("strategyUpdateTime:", strategyUpdateTime.toString(), "\nfutureStrategy:", futureStrategy);
      console.log("check 14")
    });

    it("reverts", async function () {

    });

    it("reverts", async function () {
      await expectRevert(
        makeVault(0,0),
        "cannot divide by 0"
      );

      await expectRevert(
        makeVault(100,1),
        "cannot invest more than 100%"
      );

      await expectRevert(
        vault.setVaultFractionToInvest(0, 0),
        "denominator must be greater than 0"
      );
      await expectRevert(
        vault.setVaultFractionToInvest(100, 1),
        "denominator must be greater than or equal to the numerator"
      );
      await expectRevert(
        vault.connect(signer2).withdraw(1),
        "Vault has no shares"
      );

      // await expect(
      //   ctrt.connect(signer1).setSettings(0)
      // ).to.be.revertedWith("not authorized");
      console.log("check 1")
      strategyUpdateTime = await vault.strategyUpdateTime();
      futureStrategy = await vault.futureStrategy();
      console.log("strategyUpdateTime:", strategyUpdateTime.toString(), "\nfutureStrategy:", futureStrategy);
      await expectRevert(
        vault.setStrategy(signer4.address),
        "The strategy exists and switch timelock did not elapse yet"
      );

      console.log("check 3")
      underlying2 = await MockToken.new({ from: governance });
      console.log("underlying2:", underlying2.address)
      await underlying2.mint(farmer, farmerBalance, { from: governance });
      assert.equal(
        farmerBalance,
        (await underlying2.balanceOf(farmer)).toString()
      );
      strategy2 = await NoopStrategy.new(
        storage.address,
        underlying2.address,
        vault.address,
        { from: governance }
      );
      strategyTimeLock = await vault.strategyTimeLock();
      console.log("strategy2:", strategy2.address, "\nstrategyTimeLock:", strategyTimeLock.toString());
      tx = await vault.announceStrategyUpdate(strategy2.address);
      await timeForwardInSec(strategyTimeLock.add(3600).toString());

      console.log("check 4")
      strategyUpdateTime = await vault.strategyUpdateTime();
      strategy1 = await vault.strategy();
      futureStrategy = await vault.futureStrategy();
      vault_underlying = await vault.underlying();
      strategy2underlying = await strategy2.underlying();
      console.log("\nstrategy1:", strategy1, "\nstrategyUpdateTime:", strategyUpdateTime.toString(), "\nfutureStrategy:", futureStrategy, "\nvault_underlying():", vault_underlying, "\nstrategy2underlying:", strategy2underlying);

      t1 = await getBlockTimestamp();
      strategyUpdateTime = await vault.strategyUpdateTime();
      console.log("strategyUpdateTime:", strategyUpdateTime.toString(), parseInt(t1) > parseInt(strategyUpdateTime));

      console.log("check 5")
      await expectRevert(
        vault.setStrategy(strategy2.address),
        "Vault underlying must match Strategy underlying"
      );

      strategy3 = await NoopStrategy.new(
        storage.address,
        underlying.address,
        signer1.address,
        { from: governance }
      );
      strategyTimeLock = await vault.strategyTimeLock();
      console.log("strategy3:", strategy3.address);
      tx = await vault.announceStrategyUpdate(strategy3.address);
      await timeForwardInSec(strategyTimeLock.add(3600).toString());
      await expectRevert(
        vault.setStrategy(strategy3.address),
        "the strategy does not belong to this vault"
      );

      console.log("check 6")

      // cannot initialize twice
      await expectRevert(
        vault.initializeVault(storage.address, underlying.address, 100, 100, totalSupplyCap),
        "Initializable: contract is already initialized"
      );//from ERC20Upgradeable > Initializable

      console.log("check 7")
      strategy4 = await NoopStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );
      console.log("strategy4:", strategy4.address);
      tx = await vault.announceStrategyUpdate(strategy4.address);
      await timeForwardInSec(strategyTimeLock.add(3600).toString());

      console.log("setStrategy to a new strategy")
      strategyOld = await vault.strategy();
      tx = await vault.setStrategy(strategy4.address),

      console.log("check event arguments")
      receipt = await tx.wait();
      args = getEventArgs(receipt, "StrategyChanged");
      expect(args[0]).to.equal(strategy4.address);

      expect(args[1]).to.equal(strategyOld);

      t1 = await getBlockTimestampBN();

      console.log("check 9")
      // test: only governance can upgrade... unable to invoke upgrade from other account!

      const VaultFactory = await ethers.getContractFactory("Vault");
      console.log("check 12")
      vault = await upgrades.upgradeProxy(vault.address, VaultFactory, { unsafeAllow: ['constructor'], unsafeAllowCustomTypes: true, from: signer4.address, deployer: signer4.address});//governance

      console.log("check 13")
    });
/*
    it("deposit and withdraw test with a token of 6 decimals", async function () {
      const usdcTokenUnit = "1000000";
      const usdcUnderlying = await MockUSDC.new({ from: governance });

      await usdcUnderlying.mint(farmer, farmerBalance, { from: governance });
      assert.equal(
        farmerBalance,
        (await usdcUnderlying.balanceOf(farmer)).toString()
      );

      // set up the vault with 100% investment
      const usdcVault = await makeVault();
      // const usdcVault = await makeVault(
      //   storage.address,
      //   usdcUnderlying.address,
      //   100,
      //   100,
      //   {
      //     from: governance,
      //   }
      // );

      // set up the strategy
      strategy = await NoopStrategy.new(
        storage.address,
        usdcUnderlying.address,
        usdcVault.address,
        { from: governance }
      );
      await usdcVault.setStrategy(strategy.address, { from: controller });

      assert.equal(usdcTokenUnit, await usdcVault.getPricePerFullShare());
      await usdcUnderlying.approve(usdcVault.address, farmerBalance, {
        from: farmer,
      });
      await usdcVault.deposit(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await usdcVault.balanceOf(farmer));
      assert.equal(
        farmerBalance,
        await usdcVault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(0, await usdcUnderlying.balanceOf(farmer));
      assert.equal(farmerBalance, await usdcVault.availableToInvestOut());
      assert.equal(farmerBalance, await usdcVault.underlyingBalanceInVault());
      assert.equal(usdcTokenUnit, await usdcVault.getPricePerFullShare());

      await usdcVault.withdraw(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await usdcUnderlying.balanceOf(farmer));
      assert.equal(0, await usdcVault.balanceOf(farmer));
      assert.equal(0, await usdcVault.availableToInvestOut());
      assert.equal(0, await usdcVault.underlyingBalanceInVault());
      assert.equal(
        0,
        await usdcVault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(usdcTokenUnit, await usdcVault.getPricePerFullShare());
    });

    it("deposit and withdraw test", async function () {
      assert.equal(tokenUnit, await vault.getPricePerFullShare());
      await underlying.approve(vault.address, farmerBalance, { from: farmer });
      await expectRevert(
        vault.deposit(0, {
          from: farmer,
        }),
        "Cannot deposit 0"
      );
      await expectRevert(
        vault.depositFor(farmerBalance, constants.ZERO_ADDRESS, {
          from: farmer,
        }),
        "holder must be defined"
      );
      await vault.deposit(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await vault.balanceOf(farmer));
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(0, await underlying.balanceOf(farmer));
      assert.equal(farmerBalance, await vault.availableToInvestOut());
      assert.equal(farmerBalance, await vault.underlyingBalanceInVault());
      assert.equal(tokenUnit, await vault.getPricePerFullShare());

      await expectRevert(
        vault.withdraw(0, {
          from: farmer,
        }),
        "numberOfShares must be greater than 0"
      );

      await vault.withdraw(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await underlying.balanceOf(farmer));
      assert.equal(0, await vault.balanceOf(farmer));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        0,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(tokenUnit, await vault.getPricePerFullShare());
    });

    it("deposit for and withdraw test", async function () {
      assert.equal(tokenUnit, await vault.getPricePerFullShare());
      await underlying.approve(vault.address, farmerBalance, { from: farmer });
      await vault.depositFor(farmerBalance, farmerBob, { from: farmer });
      assert.equal(farmerBalance, await vault.balanceOf(farmerBob));
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmerBob)
      );
      assert.equal(0, await vault.balanceOf(farmer));
      assert.equal(0, await underlying.balanceOf(farmer));
      assert.equal(farmerBalance, await vault.availableToInvestOut());
      assert.equal(farmerBalance, await vault.underlyingBalanceInVault());
      assert.equal(tokenUnit, await vault.getPricePerFullShare());

      await vault.withdraw(farmerBalance, { from: farmerBob });
      assert.equal(farmerBalance, await underlying.balanceOf(farmerBob));
      assert.equal(0, await vault.balanceOf(farmerBob));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        0,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(tokenUnit, await vault.getPricePerFullShare());
    });

    it("withdraw all to vault", async function () {
      await underlying.approve(vault.address, farmerBalance, { from: farmer });
      await vault.depositFor(farmerBalance, farmerBob, { from: farmer });
      assert.equal(farmerBalance, await vault.balanceOf(farmerBob));
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmerBob)
      );
      assert.equal(0, await vault.balanceOf(farmer));

      await expectRevert(
        vault.withdrawAll({ from: farmerBob }),
        "The caller must be controller or governance"
      );

      await vault.withdrawAll({ from: governance });
      assert.equal(farmerBalance, await underlying.balanceOf(vault.address));
      assert.equal(farmerBalance, await vault.underlyingBalanceInVault());
    });

    it("dohardwork test", async function () {
      // no fail on 0 balance to invest
      await vault.doHardWork({ from: governance });

      // deposit some tokens
      await underlying.approve(vault.address, farmerBalance, { from: farmer });
      await vault.deposit(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await vault.balanceOf(farmer));
      assert.equal(0, await underlying.balanceOf(farmer));
      assert.equal(farmerBalance, await vault.availableToInvestOut());
      assert.equal(farmerBalance, await vault.underlyingBalanceInVault());
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );

      // make the investment
      await vault.doHardWork({ from: controller });
      assert.equal(farmerBalance, await vault.balanceOf(farmer));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        farmerBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );

      // withdraw after the investment
      await vault.withdraw(farmerBalance, { from: farmer });
      assert.equal(farmerBalance, await underlying.balanceOf(farmer));
      assert.equal(0, await vault.balanceOf(farmer));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        0,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
    });

    it("invest test with a loss", async function () {
      // set up the strategy
      strategy = await LossStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );
      await vault.announceStrategyUpdate(strategy.address, {
        from: governance,
      });
      await Utils.waitHours(12);
      await vault.setStrategy(strategy.address, { from: controller });

      // reset token balance
      await underlying.transfer(burner, farmerBalance, { from: farmer });
      await underlying.mint(farmer, roundBalance, { from: governance });
      assert.equal(roundBalance, await underlying.balanceOf(farmer));

      // deposit some tokens
      await underlying.approve(vault.address, roundBalance, { from: farmer });
      await vault.deposit(roundBalance, { from: farmer });
      assert.equal(roundBalance, await vault.balanceOf(farmer));
      assert.equal(0, await underlying.balanceOf(farmer));
      assert.equal(roundBalance, await vault.availableToInvestOut());
      assert.equal(roundBalance, await vault.underlyingBalanceInVault());
      assert.equal(
        roundBalance,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );

      // initial doHardWork call should fail: allowSharePriceDecrease is false
      await expectRevert(
        vault.doHardWork({ from: controller }),
        "Share price should not decrease."
      );
      // now, setting allowSharePriceDecrease to true
      await vault.setAllowSharePriceDecrease(true, { from: governance });

      // make the investment
      await vault.doHardWork({ from: controller });
      assert.equal(roundBalance, await vault.balanceOf(farmer));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        roundBalancePostLoss,
        await vault.underlyingBalanceWithInvestment()
      );
      assert.equal(tokenUnit * 0.9, await vault.getPricePerFullShare());
      assert.equal(
        roundBalancePostLoss,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );

      // withdraw after the investment
      await vault.withdraw(roundBalance, { from: farmer });
      assert.equal(roundBalancePostLoss, await underlying.balanceOf(farmer));
      assert.equal(0, await vault.balanceOf(farmer));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(tokenUnit, await vault.getPricePerFullShare());
      assert.equal(
        0,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
    });

    it("2x invest test with a loss", async function () {
      // set up the strategy
      strategy = await LossStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );
      await vault.announceStrategyUpdate(strategy.address, {
        from: governance,
      });
      await Utils.waitHours(12);
      await vault.setStrategy(strategy.address, { from: controller });

      // reset token balance
      await underlying.transfer(burner, farmerBalance, { from: farmer });
      await underlying.mint(farmer, roundBalance, { from: governance });
      assert.equal(roundBalance, await underlying.balanceOf(farmer));
      await underlying.mint(farmerBob, roundBalance, { from: governance });
      assert.equal(roundBalance, await underlying.balanceOf(farmerBob));

      // deposit some tokens for both farmers
      await underlying.approve(vault.address, roundBalance, { from: farmer });
      await vault.deposit(roundBalance, { from: farmer });
      await underlying.approve(vault.address, roundBalance, {
        from: farmerBob,
      });
      await vault.deposit(roundBalance, { from: farmerBob });

      // initial doHardWork call should fail: allowSharePriceDecrease is false
      await expectRevert(
        vault.doHardWork({ from: controller }),
        "Share price should not decrease."
      );
      // now, setting allowSharePriceDecrease to true
      await vault.setAllowSharePriceDecrease(true, { from: governance });

      // make the investment
      await vault.doHardWork({ from: controller });
      assert.equal(roundBalance, await vault.balanceOf(farmer));
      assert.equal(roundBalance, await vault.balanceOf(farmerBob));
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        roundBalancePostLoss * 2,
        await vault.underlyingBalanceWithInvestment()
      );

      // withdraw after the investment for farmer
      await vault.withdraw(roundBalance, { from: farmer });
      assert.equal(roundBalancePostLoss, await underlying.balanceOf(farmer));
      assert.equal(0, await vault.balanceOf(farmer));

      // withdraw after the investment for farmerBob, the strategy eats another 10%
      await vault.withdraw(roundBalance, { from: farmerBob });
      assert.equal(roundBalancePostLoss, await underlying.balanceOf(farmerBob));
      assert.equal(0, await vault.balanceOf(farmerBob));

      // the vault has nothing
      assert.equal(0, await vault.availableToInvestOut());
      assert.equal(0, await vault.underlyingBalanceInVault());
    });

    it("2x invest test with a profit", async function () {
      // set up the strategy
      strategy = await ProfitStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );
      underlying.addMinter(strategy.address, { from: governance });
      await vault.announceStrategyUpdate(strategy.address, {
        from: governance,
      });
      await Utils.waitHours(12);
      await vault.setStrategy(strategy.address, { from: controller });

      // reset token balance
      await underlying.transfer(burner, farmerBalance, { from: farmer });
      await underlying.mint(farmer, roundBalance, { from: governance });
      assert.equal(roundBalance, await underlying.balanceOf(farmer));
      await underlying.mint(farmerBob, roundBalance, { from: governance });
      assert.equal(roundBalance, await underlying.balanceOf(farmerBob));

      // deposit some tokens for one farmer, will receive 1x shares
      await underlying.approve(vault.address, roundBalance, { from: farmer });
      await vault.deposit(roundBalance, { from: farmer });
      assert.equal(roundBalance, await vault.balanceOf(farmer));

      // make the investment
      await vault.doHardWork({ from: controller });
      assert.equal(roundBalance, await vault.balanceOf(farmer));
      assert.equal(roundBalance, await vault.totalSupply());
      assert.equal(0, await vault.underlyingBalanceInVault());
      assert.equal(
        roundBalancePostGain,
        await vault.underlyingBalanceWithInvestment()
      );
      assert.equal(
        roundBalancePostGain,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
      assert.equal(
        Math.trunc(tokenUnit) + tokenUnit / 10,
        await vault.getPricePerFullShare()
      );

      // deposit tokens for farmer Bob, will get 1:1.1 shares
      await underlying.approve(vault.address, roundBalance, {
        from: farmerBob,
      });
      await vault.deposit(roundBalance, { from: farmerBob });
      let totalSupply = roundBalance;
      let currentValue = roundBalancePostGain;
      let expectedShares = Math.trunc(
        roundBalance * (totalSupply / currentValue)
      );
      assert.equal(expectedShares, await vault.balanceOf(farmerBob));

      // make the investment
      await vault.doHardWork({ from: controller });
      assert.equal(expectedShares, await vault.balanceOf(farmerBob));
      assert.equal(
        expectedShares + Math.trunc(roundBalance),
        await vault.totalSupply()
      );
      assert.equal(0, await vault.underlyingBalanceInVault());
      Utils.assertBNEq(
        roundBalancePostGain * 2,
        await vault.underlyingBalanceWithInvestment()
      );
      Utils.assertBNEq(
        Math.trunc(
          (expectedShares * roundBalancePostGain * 2) /
            (expectedShares + Math.trunc(roundBalance))
        ),
        await vault.underlyingBalanceWithInvestmentForHolder(farmerBob)
      );

      // withdraw after the investment for farmer
      await vault.withdraw(roundBalance, { from: farmer });
      Utils.assertBNEq(
        roundBalancePostGainFarmer,
        await underlying.balanceOf(farmer)
      );
      Utils.assertBNEq(0, await vault.balanceOf(farmer));

      // withdraw after the investment for farmerBob, the strategy eats another 10%
      await vault.withdraw(expectedShares, { from: farmerBob });
      Utils.assertBNEq(
        roundBalancePostGainFarmerBob,
        await underlying.balanceOf(farmerBob)
      );
      Utils.assertBNEq(0, await vault.balanceOf(farmerBob));

      // the vault has nothing
      Utils.assertBNEq(0, await vault.availableToInvestOut());
      Utils.assertBNEq(0, await vault.underlyingBalanceInVault());
      Utils.assertBNEq(tokenUnit, await vault.getPricePerFullShare());
      Utils.assertBNEq(
        0,
        await vault.underlyingBalanceWithInvestmentForHolder(farmer)
      );
    });

    it("setting investment ratio", async function () {
      await vault.setVaultFractionToInvest(50, 100);
      // reset token balance
      await underlying.transfer(burner, farmerBalance, { from: farmer });
      await underlying.mint(farmer, roundBalance, { from: governance });
      Utils.assertBNEq(roundBalance, await underlying.balanceOf(farmer));

      // deposit some tokens for one farmer, will receive 1x shares
      await underlying.approve(vault.address, roundBalance, { from: farmer });
      await vault.deposit(roundBalance, { from: farmer });
      Utils.assertBNEq(roundBalance, await vault.balanceOf(farmer));

      // check pre-investment and post-investment
      Utils.assertBNEq(roundBalance / 2, await vault.availableToInvestOut());
      Utils.assertBNEq(roundBalance, await vault.underlyingBalanceInVault());
      await vault.doHardWork({ from: governance });
      Utils.assertBNEq(0, await vault.availableToInvestOut());
      Utils.assertBNEq(
        roundBalance / 2,
        await vault.underlyingBalanceInVault()
      );
    });

    it("withdrawBeforeReinvesting takes effect", async function () {
      await vault.setWithdrawBeforeReinvesting(true, { from: governance });
      // reset token balance
      await underlying.transfer(burner, farmerBalance, { from: farmer });
      await underlying.mint(farmer, roundBalance, { from: governance });
      Utils.assertBNEq(roundBalance, await underlying.balanceOf(farmer));

      // deposit some tokens for one farmer, will receive 1x shares
      await underlying.approve(vault.address, roundBalance, { from: farmer });
      await vault.deposit(roundBalance, { from: farmer });

      assert.equal(await strategy.withdrawAllCalled(), false);
      await vault.doHardWork({ from: governance });
      assert.equal(await strategy.withdrawAllCalled(), true);
      Utils.assertBNEq(roundBalance, await vault.balanceOf(farmer));
    });

    it("Greylist effective on smart contract, but not on EOA", async function () {
      // set up controller
      const controller = await Controller.new(storage.address, governance, {
        from: governance,
      });
      await storage.setController(controller.address, { from: governance });

      // set up the vault with 100% investment
      vault = await makeVault();
      // vault = await makeVault(storage.address, underlying.address, 100, 100, {
      //   from: governance,
      // });

      // set up the strategy
      strategy = await NoopStrategy.new(
        storage.address,
        underlying.address,
        vault.address,
        { from: governance }
      );

      // link vault with strategy
      await controller.addVaultAndStrategy(vault.address, strategy.address);

      // setup complete, now start the test

      let mockDepositBalance = 10000;
      mockGreyListed = await MockGreyListed.new(vault.address, {
        from: governance,
      });
      // mint 2 times the deposit balance to try to deposit twice
      await underlying.mint(mockGreyListed.address, 2 * mockDepositBalance, {
        from: governance,
      });

      // the controller did not greylist our contract yet.
      assert.equal(await controller.greyList(mockGreyListed.address), false);

      // should go through the first time
      await mockGreyListed.deposit(underlying.address, mockDepositBalance);
      Utils.assertBNEq(
        mockDepositBalance,
        await vault.balanceOf(mockGreyListed.address)
      );

      // greylist the smart contract `mockGreyListed`
      await controller.addToGreyList(mockGreyListed.address);

      // should not go through
      await expectRevert(
        mockGreyListed.deposit(underlying.address, mockDepositBalance),
        "This smart contract has been grey listed"
      );
      Utils.assertBNEq(
        mockDepositBalance,
        await vault.balanceOf(mockGreyListed.address)
      );

      // remove from greylist
      await controller.removeFromGreyList(mockGreyListed.address);

      // should go through
      await mockGreyListed.deposit(underlying.address, mockDepositBalance);
      Utils.assertBNEq(
        2 * mockDepositBalance,
        await vault.balanceOf(mockGreyListed.address)
      );

      // greylist an EOA human `farmer`
      await controller.addToGreyList(farmer);
      // deposit some tokens for one farmer
      await underlying.approve(vault.address, farmerBalance, { from: farmer });
      await vault.deposit(farmerBalance, { from: farmer });

      // EOA human farmer could still bypass greylist
      Utils.assertBNEq(farmerBalance, await vault.balanceOf(farmer));
    });

    describe("Flashloan prevention tests", function () {
      it("Proper share price is used", async function () {
        // set up the vault with 100% investment
        vault = await makeVault();
        // vault = await makeVault(storage.address, underlying.address, 100, 100, {
        //   from: governance,
        // });

        // set up the strategy
        strategy = await InterestEarningStrategy.new(
          storage.address,
          underlying.address,
          vault.address,
          { from: governance }
        );
        await vault.setStrategy(strategy.address, { from: controller });
        assert.equal(strategy.address, await vault.strategy());

        underlying.addMinter(strategy.address, { from: governance });

        Utils.assertBNEq(tokenUnit, await vault.getPricePerFullShare());
        await underlying.approve(vault.address, farmerBalance, {
          from: farmer,
        });
        await vault.deposit(roundBalance, { from: farmer });
        Utils.assertBNEq(roundBalance, await vault.balanceOf(farmer));
        Utils.assertBNEq(
          roundBalance,
          await vault.underlyingBalanceWithInvestmentForHolder(farmer)
        );

        // initially getPricePerFullShare is tokenUnit
        Utils.assertBNEq(tokenUnit, await vault.getPricePerFullShare());

        await vault.doHardWork({ from: governance });
        // the initial doHardWork doesn't change anything
        Utils.assertBNEq(tokenUnit, await vault.getPricePerFullShare());

        // add interest only changes getPricePerFullShare
        await strategy.addInterest({ from: governance });
        const roundBalancePlusFivePercent = roundBalance * 1.05;
        Utils.assertBNEq(
          new BigNumberjs(roundBalancePlusFivePercent)
            .times(tokenUnit)
            .dividedBy(roundBalance),
          await vault.getPricePerFullShare()
        );

        // the withdrawal amount is still roundBalance because doHardWork was not called
        // for getEstimatedWithdrawalAmount[0] it's roundBalance
        // for getEstimatedWithdrawalAmount[1] it's roundBalance + 5%
        let farmerShares = await vault.balanceOf(farmer);
        Utils.assertBNEq(farmerShares, roundBalance);
        Utils.assertBNEq(
          roundBalancePlusFivePercent,
          await vault.getEstimatedWithdrawalAmount(farmerShares)
        );

        // the next deposit would be using getPricePerFullShare
        await underlying.mint(farmer, roundBalance, { from: governance });
        const lastSharePrice = await vault.getPricePerFullShare();
        await vault.deposit(roundBalance, { from: farmer });
        farmerShares = await vault.balanceOf(farmer);

        // the number of shares issued the second time would be roundBalance * tokenUnit / lastSharePrice
        Utils.assertBNEq(
          Number(roundBalance) +
            Math.round((roundBalance * tokenUnit) / lastSharePrice) -
            1,
          farmerShares
        );

        // the farmer's balance would be roundBalance (first deposit) + roundBalancePlusFivePercent (second deposit)
        // there is a rounding problem, therefore, had to subtract 1
        const roundBalancePlusFivePercentPlusRoundBalance =
          Number(roundBalance) + Number(roundBalancePlusFivePercent) - 1;
        Utils.assertBNEq(
          roundBalancePlusFivePercentPlusRoundBalance,
          await vault.getEstimatedWithdrawalAmount(farmerShares)
        );

        // after the next doHardWork, getEstimatedWithdrawalAmount is equal to roundBalancePlusFivePercentPlusRoundBalance
        await vault.doHardWork({ from: governance });

        farmerShares = await vault.balanceOf(farmer);
        Utils.assertBNEq(
          roundBalancePlusFivePercentPlusRoundBalance,
          await vault.getEstimatedWithdrawalAmount(farmerShares)
        );

        // now, add more interest
        await strategy.addInterest({ from: governance });

        farmerShares = await vault.balanceOf(farmer);
        // this will make the two amounts differ again
        Utils.assertBNGt(
          await vault.getEstimatedWithdrawalAmount(farmerShares),
          roundBalancePlusFivePercentPlusRoundBalance
        );

        // however, ensure that the withdrawal uses the first amount
        const farmerBalanceBefore = await underlying.balanceOf(farmer);
        const estimate = await vault.getEstimatedWithdrawalAmount(farmerShares);
        // withdrawing half of the shares, otherwise we are hitting the edge case when the entire shares are withdrawn
        await vault.withdraw(farmerShares / 2, { from: farmer });
        Utils.assertBNEq(
          new BigNumberjs(estimate).dividedBy(2),
          (await underlying.balanceOf(farmer)) - farmerBalanceBefore
        );
      });

      it("Proper share parameters on withdraw", async function () {
        // set up the vault with 100% investment
        vault = await makeVault();
        // vault = await makeVault(storage.address, underlying.address, 100, 100, {
        //   from: governance,
        // });

        // set up the strategy
        strategy = await InterestEarningStrategy.new(
          storage.address,
          underlying.address,
          vault.address,
          { from: governance }
        );
        await vault.setStrategy(strategy.address, { from: controller });
        assert.equal(strategy.address, await vault.strategy());

        underlying.addMinter(strategy.address, { from: governance });

        // two farmers, each investing the same
        await underlying.approve(vault.address, farmerBalance, {
          from: farmer,
        });
        await vault.deposit(roundBalance, { from: farmer });
        await underlying.mint(farmerBob, farmerBalance, { from: governance });
        await underlying.approve(vault.address, farmerBalance, {
          from: farmerBob,
        });
        await vault.deposit(roundBalance, { from: farmerBob });

        // do hard work to invest all
        await vault.doHardWork({ from: governance });

        // farmer will withdraw, we will get 2x farmerBalance shares total and farmerBalance of shares
        // as the parameters to the withdrawToVault
        await vault.withdraw(roundBalance, { from: farmer });

        assert.equal(await strategy.test_sharesWithdraw(), roundBalance);
        Utils.assertBNEq(
          await strategy.test_sharesTotalWithdraw(),
          roundBalance * 2
        );

        // once again with different numbers
        await underlying.approve(vault.address, farmerBalance, {
          from: farmer,
        });
        await vault.deposit(roundBalance, { from: farmer });
        await vault.doHardWork({ from: governance });

        // farmer will withdraw half, we will get 2x farmerBalance shares total and farmerBalance / 2 of shares
        await vault.withdraw(roundBalance / 2, { from: farmer });
        assert.equal(await strategy.test_sharesWithdraw(), roundBalance / 2);
        Utils.assertBNEq(
          await strategy.test_sharesTotalWithdraw(),
          roundBalance * 2
        );

        // farmer will withdraw half, we will get 1.5x farmerBalance shares total and farmerBalance / 2 of shares
        await vault.withdraw(roundBalance / 2, { from: farmer });
        assert.equal(await strategy.test_sharesWithdraw(), roundBalance / 2);
        Utils.assertBNEq(
          await strategy.test_sharesTotalWithdraw(),
          roundBalance * 1.5
        );
      });
    });

    describe("Upgradability test", function () {
      // ensures that deposits are intact after an upgrade
      // and that the strategy can no longer be changed in the upgraded vault
      // (to confirm the behavior changed after an upgrade)

      // updated to upgrade VaultV2 (older version) to the current Vault (V3)
      let vault, vaultAsProxy, vaultImplementation, vaultUpgradableSoonerImpl;
      const shorterDelay = 100; // seconds

      it("Interaction with vault being upgraded", async function () {
        vaultImplementation = await VaultUpgradableSooner.new({
          from: governance,
        });
        vaultAsProxy = await VaultProxy.new(vaultImplementation.address, {
          from: governance,
        });

        // making the vault upgradable faster
        vault = await Vault.at(vaultAsProxy.address);
        await vault.initializeVault(
          storage.address,
          underlying.address,
          100,
          100,
          {
            from: governance,
          }
        );
        vaultUpgradableSoonerImpl = await VaultUpgradableSooner.at(
          vaultAsProxy.address
        );
        await vaultUpgradableSoonerImpl.overrideNextImplementationDelay(
          shorterDelay
        );

        // set up the strategy
        strategy = await ProfitStrategy.new(
          storage.address,
          underlying.address,
          vault.address,
          { from: governance }
        );
        underlying.addMinter(strategy.address, { from: governance });

        await vault.setStrategy(strategy.address, { from: controller });

        // reset token balance
        await underlying.transfer(burner, farmerBalance, { from: farmer });
        await underlying.mint(farmer, roundBalance, { from: governance });
        Utils.assertBNEq(roundBalance, await underlying.balanceOf(farmer));
        await underlying.mint(farmerBob, roundBalance, { from: governance });
        Utils.assertBNEq(roundBalance, await underlying.balanceOf(farmerBob));

        // deposit some tokens for one farmer, will receive 1x shares
        await underlying.approve(vault.address, roundBalance, { from: farmer });
        await vault.deposit(roundBalance, { from: farmer });
        Utils.assertBNEq(roundBalance, await vault.balanceOf(farmer));

        // okay, the balances are in. Now, scheduling upgrades

        // initially, shouldUpgrade is false
        let shouldUpgrade = await vault.shouldUpgrade();
        assert.equal(false, shouldUpgrade[0]);
        assert.equal(
          "0x0000000000000000000000000000000000000000",
          shouldUpgrade[1]
        );

        newVault = await Vault.new({
          from: governance,
        });

        await vault.scheduleUpgrade(newVault.address, {
          from: governance,
        });

        shouldUpgrade = await vault.shouldUpgrade();
        assert.equal(false, shouldUpgrade[0]);
        assert.equal(newVault.address, shouldUpgrade[1]);

        // upgrading now would fail:

        await expectRevert(
          vaultAsProxy.upgrade({
            from: governance,
          }),
          "Upgrade not scheduled"
        );

        assert.equal(
          vaultImplementation.address,
          await vaultAsProxy.implementation()
        );

        // advancing time to whenever it is possible to upgrade
        await Utils.advanceNBlock(Math.round(shorterDelay / 15) + 1);

        // now, shouldUpgrade is true
        shouldUpgrade = await vault.shouldUpgrade();
        assert.equal(true, shouldUpgrade[0]);
        assert.equal(newVault.address, shouldUpgrade[1]);

        // Upgrading!!!
        assert.equal(
          vaultImplementation.address,
          await vaultAsProxy.implementation()
        );

        const oldSharePrice = await vault.getPricePerFullShare();

        await vaultAsProxy.upgrade({
          from: governance,
        });
        assert.equal(newVault.address, await vaultAsProxy.implementation());

        // After this, the vault should be upgraded /
        // checking that the behaviour has actually changed
        assert.equal(false, await vault.allowSharePriceDecrease());
        assert.equal(false, await vault.withdrawBeforeReinvesting());

        // checking the legacy behaviour also
        await expectRevert(
          vault.setStrategy(strategy.address, {
            from: governance,
          }),
          "The strategy exists and switch timelock did not elapse yet."
        );

        // now, shouldUpgrade is back to false
        shouldUpgrade = await vault.shouldUpgrade();
        assert.equal(false, shouldUpgrade[0]);
        assert.equal(
          "0x0000000000000000000000000000000000000000",
          shouldUpgrade[1]
        );

        // Continue interactions as before
        // The following is copy-paste from the Profit test above

        await vault.doHardWork({ from: controller });
        Utils.assertBNEq(roundBalance, await vault.balanceOf(farmer));
        Utils.assertBNEq(roundBalance, await vault.totalSupply());
        Utils.assertBNEq(0, await vault.underlyingBalanceInVault());
        Utils.assertBNEq(
          roundBalancePostGain,
          await vault.underlyingBalanceWithInvestment()
        );
        Utils.assertBNEq(
          roundBalancePostGain,
          await vault.underlyingBalanceWithInvestmentForHolder(farmer)
        );
        Utils.assertBNEq(
          Math.trunc(tokenUnit) + tokenUnit / 10,
          await vault.getPricePerFullShare()
        );

        // deposit tokens for farmer Bob, will get 1:1.1 shares
        await underlying.approve(vault.address, roundBalance, {
          from: farmerBob,
        });
        await vault.deposit(roundBalance, { from: farmerBob });
        let totalSupply = roundBalance;
        let currentValue = roundBalancePostGain;
        let expectedShares = Math.trunc(
          roundBalance * (totalSupply / currentValue)
        );
        Utils.assertBNEq(expectedShares, await vault.balanceOf(farmerBob));

        // make the investment
        await vault.doHardWork({ from: controller });
        Utils.assertBNEq(expectedShares, await vault.balanceOf(farmerBob));
        Utils.assertBNEq(
          expectedShares + Math.trunc(roundBalance),
          await vault.totalSupply()
        );
        Utils.assertBNEq(0, await vault.underlyingBalanceInVault());
        Utils.assertBNEq(
          roundBalancePostGain * 2,
          await vault.underlyingBalanceWithInvestment()
        );
        Utils.assertBNEq(
          Math.trunc(
            (expectedShares * roundBalancePostGain * 2) /
              (expectedShares + Math.trunc(roundBalance))
          ),
          await vault.underlyingBalanceWithInvestmentForHolder(farmerBob)
        );

        // withdraw after the investment for farmer
        await vault.withdraw(roundBalance, { from: farmer });
        Utils.assertBNEq(
          roundBalancePostGainFarmer,
          await underlying.balanceOf(farmer)
        );
        Utils.assertBNEq(0, await vault.balanceOf(farmer));

        // withdraw after the investment for farmerBob, the strategy eats another 10%
        await vault.withdraw(expectedShares, { from: farmerBob });
        Utils.assertBNEq(
          roundBalancePostGainFarmerBob,
          await underlying.balanceOf(farmerBob)
        );
        Utils.assertBNEq(0, await vault.balanceOf(farmerBob));

        // the vault has nothing
        Utils.assertBNEq(0, await vault.availableToInvestOut());
        Utils.assertBNEq(0, await vault.underlyingBalanceInVault());
        Utils.assertBNEq(tokenUnit, await vault.getPricePerFullShare());
        Utils.assertBNEq(
          0,
          await vault.underlyingBalanceWithInvestmentForHolder(farmer)
        );
      });
    });
    */

  });
});
