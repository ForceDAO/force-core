const MockToken = artifacts.require("MockToken");
const Storage = artifacts.require("Storage");
//const Controller = artifacts.require("Controller");
const ForceProfitSharing = artifacts.require('ForceProfitSharing');
//const MockERC20 = artifacts.require('MockERC20');
const MockFeeRewardForwarder = artifacts.require('MockFeeRewardForwarder');

const { expect } = require("chai");
const { BigNumber } = require("ethers");
const bigNum = (item) => BigNumber.from(item);
const log1 = console.log;

// npx hardhat test test/1featAddWhiteList.js
contract("Vault Test", function (accounts) {
  describe("TotalSupplyCap", function () {
    let governance = accounts[0];
    let farmer = accounts[2];
    let storage, controller, Vault, vaultInst, underlying, signers;
    let out;

    const farmerBalance = "95848503450";

    log1("check4");

    beforeEach(async function () {
      signers = await hre.ethers.getSigners();
      storage = await Storage.new({ from: governance });
      // create the underlying token
      underlying = await MockToken.new({ from: governance });
      storage = await Storage.new();
      
      profitSharingPool = await ForceProfitSharing.new(underlying.address);

      feeRewardForwarder = await MockFeeRewardForwarder.new(
        storage.address,
        underlying.address,
        profitSharingPool.address,
      );

      const controllerFactory = await ethers.getContractFactory("Controller");
      controllerInst = await controllerFactory.deploy(        storage.address, feeRewardForwarder.address);
      await controllerInst.deployed();
      expect(controllerInst.address).to.properAddress;
      log1("controller contract is deployed to:", controllerInst.address);
      // controllerInst = await Controller.new(
      //   storage.address,
      //   feeRewardForwarder.address
      // );
      await storage.setController(controllerInst.address, { from: governance });

      //------------==
      await underlying.mint(farmer, farmerBalance, { from: governance });
      assert.equal(
        farmerBalance,
        (await underlying.balanceOf(farmer)).toString()
      );
      Vault = await ethers.getContractFactory("Vault");
      vaultInst = await upgrades.deployProxy(
        Vault,
        [storage.address, underlying.address, 100, 100],
        {
          initializer:
            "initializeVault(address,address,uint256,uint256)",
          unsafeAllowCustomTypes: true,
          from: governance,
        }
      );
      log1("Vault deployed to:", vaultInst.address);
      //vaultInst = await upgrades.upgradeProxy(vaultInst.address, Vault);
    });

    // Vault: modifier defense(): IController(controller()).whiteList(msg.sender)

    describe('addToWhiteList', () => {
      let _whitelist = accounts[5];
  
      it('Revert from non-owner', async () => {
        nonGov = signers[4];
        log1("governance:", governance, ", nonGov:", nonGov.address);
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
      let _whitelist = accounts[5];
  
      it('Revert from non-owner', async () => {
        nonGov = signers[4];
        log1("governance:", governance, ", nonGov:", nonGov.address);
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
  });
});
