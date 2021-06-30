const { BigNumber, constants } = require("ethers");
import { ethers, upgrades, network } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { expect, use } from "chai";

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

    describe( "Add to Whitelist", () => {

        it('Revert from non-owner', async () => {
            await expect(storageInstance.connect(strangerSigner).addToWhiteList(whitelistAddress))
            .to.be.revertedWith("Not governance");
        });

        it('Should add to whitelist', async () => {
            let isWhiteListed = await storageInstance.whiteList(whitelistAddress)
            expect(isWhiteListed).to.be.false;

            await storageInstance.addToWhiteList(whitelistAddress);
            let isWhiteListed_1 = await storageInstance.whiteList(whitelistAddress)
            expect(isWhiteListed_1).to.be.true;
        });
   });

   describe('removeFromWhiteList', () => {

    it('Revert from non-owner', async () => {
      await expect(
        storageInstance.connect(strangerSigner).removeFromWhiteList(whitelistAddress)
      ).to.be.revertedWith("Not governance");
    });

    it('Should remove from whitelist', async () => {
      await storageInstance.addToWhiteList(whitelistAddress);
      let isWhiteListed = await storageInstance.whiteList(whitelistAddress);
      expect(isWhiteListed).to.be.true;
        
      await storageInstance.removeFromWhiteList(whitelistAddress);
      let isWhiteListed_1 = await storageInstance.whiteList(whitelistAddress);
      expect(isWhiteListed_1).to.be.false;
    });
  });

  
});