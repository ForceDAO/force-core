import { ethers, upgrades, network } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { expect, use } from "chai";
import { BigNumber, constants, Contract } from "ethers";

const amountToMint = BigNumber.from("10000");

describe("Whitelisting Functions",  () => {
    var governance: any;
    var governanceAddress: string;
    var strangerSigner: any;
    var strangerAddress: string;
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
    var whitelistSigner : any;
    var whitelistAddress : string;

    const underlyingSymbol = "MOCK";
    let underlyingDecimals = "18";
    const underlyingDecimalsBN = BigNumber.from(10).pow(BigNumber.from(underlyingDecimals));
    const totalSupplyCap = BigNumber.from(1000).mul(underlyingDecimalsBN);

    let mockDepositor: Contract;

    beforeEach(async function () {
      [governance, controller, whitelistSigner, strangerSigner] = await ethers.getSigners();
      governanceAddress = await governance.getAddress();
      controllerAddress = await controller.getAddress();
      whitelistAddress = await whitelistSigner.getAddress();
      strangerAddress = await strangerSigner.getAddress();

      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [governanceAddress]}
      );

      const MockDepositor = await ethers.getContractFactory("MockVaultDepositor");
      mockDepositor = await MockDepositor.deploy();

      
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

        await underlying.mint(governance.address, amountToMint);
        await underlying.approve(mockDepositor.address, amountToMint);
    });

    describe( "Add to Whitelist", () => {

        it('should revert from non-owner', async () => {
            await expect(storageInstance.connect(strangerSigner).addToWhiteList(whitelistAddress))
            .to.be.revertedWith("Not governance");
        });

        it('should add to whitelist', async () => {
            let isWhiteListed = await storageInstance.whiteList(whitelistAddress)
            expect(isWhiteListed).to.be.false;

            await storageInstance.addToWhiteList(whitelistAddress);
            let isWhiteListed_1 = await storageInstance.whiteList(whitelistAddress)
            expect(isWhiteListed_1).to.be.true;
        });
   });

   describe('remove From WhiteList', () => {

    it('should revert from non-owner', async () => {
      await expect(
        storageInstance.connect(strangerSigner).removeFromWhiteList(whitelistAddress)
      ).to.be.revertedWith("Not governance");
    });

    it('should remove from whitelist', async () => {
      await storageInstance.addToWhiteList(whitelistAddress);
      let isWhiteListed = await storageInstance.whiteList(whitelistAddress);
      expect(isWhiteListed).to.be.true;
        
      await storageInstance.removeFromWhiteList(whitelistAddress);
      let isWhiteListed_1 = await storageInstance.whiteList(whitelistAddress);
      expect(isWhiteListed_1).to.be.false;
    });
  });

  describe('deposit from a contract', () => {

    it('Revert to deposit from non-whitelisted contracts', async () => {

      expect(await storageInstance.whiteList(mockDepositor.address)).to.be.false;

      await expect(
        mockDepositor.depositFor(governanceAddress, underlying.address, vaultProxyInst.address, amountToMint)
      ).to.be.revertedWith('This smart contract is not whitelisted');

      await expect(
        mockDepositor.deposit(underlying.address, vaultProxyInst.address, amountToMint)
        ).to.be.revertedWith('This smart contract is not whitelisted');
    });

    it('Deposit from whitelisted contracts', async () => {
      
      await storageInstance.addToWhiteList(mockDepositor.address);
      expect(await storageInstance.whiteList(mockDepositor.address)).to.be.true;

      await mockDepositor.depositFor(governanceAddress, underlying.address, vaultProxyInst.address, amountToMint.div(2));
      expect(await vaultProxyInst.balanceOf(governance.address)).to.equal(amountToMint.div(2));

      await mockDepositor.deposit(underlying.address, vaultProxyInst.address, amountToMint.div(2));
      expect(await vaultProxyInst.balanceOf(mockDepositor.address)).to.equal(amountToMint.div(2));

    });

    it('should fail to deposit and withdraw in the same block', async () => {

      await storageInstance.addToWhiteList(mockDepositor.address);
      expect(await storageInstance.whiteList(mockDepositor.address)).to.be.true;

      await expect(
        mockDepositor.depositAndWithdraw(underlying.address, vaultProxyInst.address, amountToMint)
      ).to.be.revertedWith('withdraw: withdraw in same block not permitted');

      await expect(
        mockDepositor.depositForAndWithdraw(governanceAddress, underlying.address, vaultProxyInst.address, amountToMint)
      ).to.be.revertedWith('withdraw: withdraw in same block not permitted');

    });
  });

});