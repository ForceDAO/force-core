const { BigNumber, constants } = require("ethers");
import { ethers, upgrades, network } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { expect, use } from "chai";

describe("SupplyCap Tests", () => {

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
    
    const farmerBalance = "95848503450";
    let underlyingDecimals = "18";
    const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
    const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);
    const newTotalSupplyCap = BigNumber.from(100).mul(underlyingDecimalsBN);

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

    it('Check total supply cap', async () => {
      expect(await vaultProxyInst.totalSupplyCap()).to.be.equal(totalSupplyCap);
    });

    it('Revert from non-governance', async () => {
      let signers = await ethers.getSigners();
      await expect(
        vaultProxyInst.connect(signers[3]).setTotalSupplyCap(newTotalSupplyCap)
      ).to.be.revertedWith('Not governance');
    });

    it('Only governance can set total supply cap', async () => {
      await vaultProxyInst.setTotalSupplyCap(newTotalSupplyCap, { from: governanceAddress });
      const totalSupplyCap = await vaultProxyInst.totalSupplyCap();
      expect(totalSupplyCap).to.be.equal(newTotalSupplyCap.toString());
    });

    it('Revert when exceed total supply limit', async () => {
      let signers = await ethers.getSigners();
      const depositAmount = totalSupplyCap.add(1);

      await expect(
        vaultProxyInst.connect(signers[2]).deposit(depositAmount)
      ).to.be.revertedWith("Cannot mint more than cap");

      await expect(
        vaultProxyInst.connect(signers[3]).depositFor(depositAmount, signers[3].address)
      ).to.be.revertedWith("Cannot mint more than cap");

    });

    after('Reset', async () => {
      await vaultProxyInst.setTotalSupplyCap(totalSupplyCap, { from: governanceAddress });
    });
  });