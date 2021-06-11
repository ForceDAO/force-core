const MockToken = artifacts.require("MockToken");
const Storage = artifacts.require("Storage");
const MockFeeRewardForwarder = artifacts.require('MockFeeRewardForwarder');

const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Add White List", function () {
  let alice, bob, carol;
  let governance, farmer;
  let storage, VaultFactory, vault, underlying, depositor, signers;

  const underlyingDecimals = "18";
  const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
  const farmerBalance = BigNumber.from('80000').mul(underlyingDecimalsBN);
  const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);


  beforeEach(async function () {
    signers = await hre.ethers.getSigners();
    governance = signers[0].address;
    alice = signers[1].address;
    bob = signers[2].address;
    carol = signers[3].address;
    _whitelist = signers[5].address;
    farmer = signers[2].address;

    storage = await Storage.new({ from: governance });
    // create the underlying token
    underlying = await MockToken.new({ from: governance });
    storage = await Storage.new();
    
    feeRewardForwarder = await MockFeeRewardForwarder.new(
      storage.address,
      underlying.address,
      signers[4].address,
    );

    const controllerFactory = await ethers.getContractFactory("Controller");
    controllerInst = await controllerFactory.deploy(storage.address, feeRewardForwarder.address);
    await controllerInst.deployed();
    expect(controllerInst.address).to.properAddress;

    await storage.setController(controllerInst.address, { from: governance });

    //------------==
    await underlying.mint(farmer, farmerBalance, { from: governance });
    assert.equal(
      farmerBalance,
      (await underlying.balanceOf(farmer)).toString()
    );

    VaultFactory = await ethers.getContractFactory("Vault");
    vault = await upgrades.deployProxy(
      VaultFactory,
      [storage.address, underlying.address, 100, 100, totalSupplyCap],
      {
        initializer:
          "initializeVault(address,address,uint256,uint256,uint256)",
        unsafeAllowCustomTypes: true,
        unsafeAllow: ['constructor'],
        from: governance,
      }
    );

    const MockVaultDepositorFactory = await ethers.getContractFactory("MockVaultDepositor");
    depositor = await MockVaultDepositorFactory.deploy();
    await depositor.deployed();
    expect(depositor.address).to.properAddress;


    //------------==
    await underlying.mint(governance, farmerBalance, { from: governance });
    assert.equal(
      farmerBalance,
      (await underlying.balanceOf(governance)).toString()
    );
    const initalTransferAmount = BigNumber.from('10000').mul(underlyingDecimalsBN);

    await underlying.transfer(alice, initalTransferAmount,{ from: governance });
    await underlying.approve(vault.address, initalTransferAmount, {
      from: alice,
    });
    await underlying.approve(depositor.address, initalTransferAmount, {
      from: alice,
    });
    await underlying.transfer(bob, initalTransferAmount);
    await underlying.approve(vault.address, initalTransferAmount, {
      from: bob,
    });
    await underlying.transfer(carol, initalTransferAmount);
    await underlying.approve(vault.address, initalTransferAmount, {
      from: carol,
    });
  });

  describe('addToWhiteList', () => {

    it('Revert from non-owner', async () => {
      nonGov = signers[4];

      await expect(
        controllerInst.connect(nonGov).addToWhiteList(_whitelist)
      ).to.be.revertedWith("Not governance");
    });

    it('Should add to whitelist', async () => {
      assert.equal(await controllerInst.whiteList(_whitelist), false);
      await controllerInst.addToWhiteList(_whitelist);
      assert.equal(await controllerInst.whiteList(_whitelist), true);
    });
  });

  describe('removeFromWhiteList', () => {

    it('Revert from non-owner', async () => {
      nonGov = signers[4];

      await expect(
        controllerInst.connect(nonGov).removeFromWhiteList(_whitelist)
      ).to.be.revertedWith("Not governance");
    });

    it('Should remove from whitelist', async () => {
      assert.equal(await controllerInst.whiteList(_whitelist), false);
      await controllerInst.addToWhiteList(_whitelist);
      assert.equal(await controllerInst.whiteList(_whitelist), true);

      await controllerInst.removeFromWhiteList(_whitelist);
      assert.equal(await controllerInst.whiteList(_whitelist), false);
    });
  });

  describe('deposit from a contract', () => {

    it('Revert to deposit from non-whitelisted contracts', async () => {
      const depositAmount = BigNumber.from('100').mul(underlyingDecimalsBN);

      assert.equal(await controllerInst.whiteList(depositor.address), false);

      await expect(
        depositor.connect(signers[1]).depositFor(underlying.address, vault.address, depositAmount)
      ).to.be.revertedWith('This smart contract is not whitelisted');

      await expect(
        depositor.connect(signers[1]).deposit(underlying.address, vault.address, depositAmount)
        ).to.be.revertedWith('This smart contract is not whitelisted');
    });

    it('Deposit from whitelisted contracts', async () => {
      
      const depositAmount = BigNumber.from('100').mul(underlyingDecimalsBN);
      await controllerInst.addToWhiteList(depositor.address);
      assert.equal(await controllerInst.whiteList(depositor.address), true);

      await depositor.connect(signers[1]).depositFor(underlying.address, vault.address, depositAmount);

      expect(await vault.balanceOf(signers[1].address)).to.equal(depositAmount);

      await depositor.connect(signers[1]).deposit(underlying.address, vault.address, depositAmount);

      expect(await vault.balanceOf(depositor.address)).to.equal(depositAmount);

    });
  });
});
