const { BigNumber, constants } = require("ethers");
import { ethers, upgrades, network } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { expect, use } from "chai";

describe("Vault Proxy Functions",  () => {
    var governance: any;
    var governanceAddress: string;
    var controller: any;
    var controllerAddress: string;
    var StorageContract: any;
    var storageInstance: any;
    var Vault: any;
    var vaultProxyInst: any;
    var vaultProxyAddress: string;
    var vaultImplementationAddress: string;
    var underlying: any;
    var underlyingAddress: any;
    var MockUpgradedVault: any;
    var vaultUpgradedImplementationAddress: string;

    const underlyingSymbol = "MOCK";
    let underlyingDecimals = "18";
    const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
    const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);

    before(async function () {
      [governance, controller] = await ethers.getSigners();
      governanceAddress = await governance.getAddress();
      controllerAddress = await controller.getAddress();

      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [governanceAddress]}
      );

      StorageContract = await ethers.getContractFactory("Storage");
      storageInstance = await StorageContract.deploy();
      
      await storageInstance.setController(controllerAddress, { from: governanceAddress });

      // create the underlying token
      const MockToken = await ethers.getContractFactory("MockToken");
      underlying = await MockToken.deploy();
      underlyingAddress = underlying.address;

      Vault = await ethers.getContractFactory("Vault");

      vaultProxyInst = await upgrades.deployProxy(Vault, 
      [storageInstance.address, underlying.address, 100, 100, totalSupplyCap],
       {
         initializer: 'initializeVault(address,address,uint256,uint256,uint256)', 
         unsafeAllow: ['constructor'],
         unsafeAllowCustomTypes: true
      });
      vaultProxyAddress = vaultProxyInst.address;
      vaultImplementationAddress = await getImplementationAddress(network.provider, vaultProxyAddress);
    });

    it('should fail if deployed with zero addresses', async () => {
      await expect(
        upgrades.deployProxy(
          Vault,
          [
            constants.AddressZero,
            underlyingAddress,
            100,
            100,
            totalSupplyCap
          ],
          {
            initializer: 'initializeVault(address,address,uint256,uint256,uint256)',
            unsafeAllow: ['constructor'],
            unsafeAllowCustomTypes: true
          }
        )
      ).to.be.revertedWith('Vault: cannot set 0 address');

      await expect(
        upgrades.deployProxy(
          Vault,
          [
            storageInstance.address,
            constants.AddressZero,
            100,
            100,
            totalSupplyCap
          ],
          {
            initializer: 'initializeVault(address,address,uint256,uint256,uint256)',
            unsafeAllow: ['constructor'],
            unsafeAllowCustomTypes: true
          }
        )
      ).to.be.revertedWith('Vault: cannot set 0 address');

    });

    it('proxy should upgrade to new Vault', async () => {

      MockUpgradedVault = await ethers.getContractFactory("MockUpgradedVault");
      
      const vaultUpgraded = await upgrades.upgradeProxy(
        vaultProxyAddress,
        MockUpgradedVault,
        {
          unsafeAllow: ['constructor'],
          unsafeAllowCustomTypes: true
        });
      
      const vaultUpgradedImplementationAddress = await getImplementationAddress(network.provider, vaultProxyAddress);
      expect(vaultUpgradedImplementationAddress).not.to.be.equal(vaultImplementationAddress);
    });

    it('Vault name should have "FORCE" prefix', async () => {
      const vaultTokenName = await vaultProxyInst.name();
      expect(vaultTokenName).to.be.equal(`FORCE_${underlyingSymbol}`);
    });

    it('Vault symbol should have "x" prefix', async () => {
      const vaultTokenSymbol = await vaultProxyInst.symbol();
      expect(vaultTokenSymbol).to.be.equal(`x${underlyingSymbol}`);
    });
});