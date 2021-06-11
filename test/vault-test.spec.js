const MockToken = artifacts.require("MockToken");
const Storage = artifacts.require("Storage");

const { BigNumber, constants } = require("ethers");

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

    let underlyingDecimals = "18";
    const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
    const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);


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
      vaultInst = await upgrades.deployProxy(Vault, [storage.address, underlying.address, 100, 100, totalSupplyCap], {initializer: 'initializeVault(address,address,uint256,uint256,uint256)', unsafeAllow: ['constructor'], unsafeAllowCustomTypes: true, from: governance});
    });


    it('should fail if deployed with zero addresses', async () => {
      await expect(
        upgrades.deployProxy(
          Vault,
          [
            constants.AddressZero,
            underlying.address,
            100,
            100,
            totalSupplyCap
          ],
          {
            initializer: 'initializeVault(address,address,uint256,uint256,uint256)',
            unsafeAllow: ['constructor'],
            unsafeAllowCustomTypes: true,
            from: governance
          }
        )
      ).to.be.revertedWith('Vault: cannot set 0 address');

      await expect(
        upgrades.deployProxy(
          Vault,
          [
            storage.address,
            constants.AddressZero,
            100,
            100,
            totalSupplyCap
          ],
          {
            initializer: 'initializeVault(address,address,uint256,uint256,uint256)',
            unsafeAllow: ['constructor'],
            unsafeAllowCustomTypes: true,
            from: governance
          }
        )
      ).to.be.revertedWith('Vault: cannot set 0 address');

    });

    it('Vault name should have "FORCE" prefix', async () => {
      const vaultTokenName = await vaultInst.name();
      assert.equal(vaultTokenName, `FORCE_${underlyingSymbol}`);
    });

    it('Vault symbol should have "x" prefix', async () => {
      const vaultTokenSymbol = await vaultInst.symbol();
      assert.equal(vaultTokenSymbol, `x${underlyingSymbol}`);
    });

  });
});
