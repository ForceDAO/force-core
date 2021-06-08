const MockToken = artifacts.require("MockToken");
const Storage = artifacts.require("Storage");

//const makeVault = require("./make-vault.js");

// npx hardhat test test/vault-test2.js
contract("Vault Test", function (accounts) {
  describe("Deposit and Withdraw", function () {
    let governance = accounts[0];
    let controller = accounts[1];
    let farmer = accounts[2];

    let storage;
    let Vault, vaultInst;
    let underlying;

    const farmerBalance = "95848503450";
    const underlyingSymbol = "MOCK";
    const log1 = console.log;

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
      vaultInst = await upgrades.deployProxy(Vault, [storage.address, underlying.address, 100, 100], {initializer: 'initializeVault(address,address,uint256,uint256)', unsafeAllowCustomTypes: true, from: governance});
      log1("Vault deployed to:", vaultInst.address);
      //vaultInst = await upgrades.upgradeProxy(vaultInst.address, Vault);
    });

    it('Vault name should have "FORCE" prefix', async () => {
      log1("check name")
      const vaultTokenName = await vaultInst.name();
      log1("vaultTokenName:", vaultTokenName);
      assert.equal(vaultTokenName, `FORCE_${underlyingSymbol}`);
    });

    it('Vault symbol should have "x" prefix', async () => {
      log1("check symbol")
      const vaultTokenSymbol = await vaultInst.symbol();
      log1("vaultTokenSymbol:", vaultTokenSymbol);
      assert.equal(await vaultInst.symbol(), `x${underlyingSymbol}`);
    });

  });
});
