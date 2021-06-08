const MockToken = artifacts.require("MockToken");
const Storage = artifacts.require("Storage");

const { expect } = require("chai");
const { BigNumber } = require("ethers");
const bigNum = (item) => BigNumber.from(item);
const log1 = console.log;

// npx hardhat test test/1featSupplyCap.js
contract("Vault Test", function (accounts) {
  describe("TotalSupplyCap", function () {
    let governance = accounts[0];
    let controller = accounts[1];
    let farmer = accounts[2];
    let nonGov = accounts[6];

    let storage, Vault, vaultInst, underlying;
    let out;

    const farmerBalance = "95848503450";

    let underlyingDecimals = "18";
    let underlyingDecimalsBN = bigNum(10).pow(bigNum(underlyingDecimals));
    const totalSupplyCap = bigNum(1000).mul(underlyingDecimalsBN);
    const newTotalSupplyCap = bigNum(100).mul(underlyingDecimalsBN);
    log1("check4")

    beforeEach(async function () {
      storage = await Storage.new({ from: governance });
      await storage.setController(controller, { from: governance });
      // create the underlying token
      underlying = await MockToken.new({ from: governance });
      await underlying.mint(farmer, farmerBalance, { from: governance });
      assert.equal(
        farmerBalance,
        (await underlying.balanceOf(farmer)).toString()
      );
      Vault = await ethers.getContractFactory("Vault");
      vaultInst = await upgrades.deployProxy(
        Vault,
        [storage.address, underlying.address, 100, 100, totalSupplyCap],
        {
          initializer: "initializeVault(address,address,uint256,uint256,uint256)",
          unsafeAllowCustomTypes: true,
          from: governance,
        }
      );
      log1("Vault deployed to:", vaultInst.address);
      //vaultInst = await upgrades.upgradeProxy(vaultInst.address, Vault);
    });

    it('Check total supply cap', async () => {
      log1("check1: totalSupplyCap");
      expect(await vaultInst.totalSupplyCap()).to.equal(totalSupplyCap);
    });

    it('Revert from non-governance', async () => {
      log1("governance:", governance,  ", nonGov:", nonGov);
      let signers = await hre.ethers.getSigners();
      await expect(
        vaultInst.connect(signers[3]).setTotalSupplyCap(newTotalSupplyCap)
      ).to.be.revertedWith('Not governance');

    });

    it('Only governance can set total supply cap', async () => {
      await vaultInst.setTotalSupplyCap(newTotalSupplyCap, { from: governance });
      assert.equal(
        await vaultInst.totalSupplyCap(),
        newTotalSupplyCap.toString(),
      );
    });

    it('Cannot mint over supply cap', async () => {
      // deposit(...) requirement: totalSupplyCap() == 0 || totalSupply().add(toMint) <= totalSupplyCap(),
    });

    after('Reset', async () => {
      await vaultInst.setTotalSupplyCap(totalSupplyCap, { from: governance });
    });

  });
});
