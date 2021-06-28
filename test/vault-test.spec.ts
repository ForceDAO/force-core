
const { BigNumber, constants } = require("ethers");
import { ethers, upgrades, network } from "hardhat";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { expect, use } from "chai";
import { WMATIC_ADDRESS, FORCE_ADDRESS, SUSHI_ADDRESS,
         USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS, MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT, 
         STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS} 
         from "./polygon-mainnet-fork-test-config";

  describe("Vault Proxy Functions",  () => {

    var governance: any;
    var governanceAddress: string;
    var controller: any;
    var controllerAddress: string;
    var farmer: any;
    var farmerAddress: string;


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
    const farmerBalance = "95848503450";

    before(async function () {
      [governance, controller, farmer] = await ethers.getSigners();
      governanceAddress = await governance.getAddress();
      controllerAddress = await controller.getAddress();
      farmerAddress = await farmer.getAddress();

      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [STRATEGY_OWNER]}
      );
      // const signer = await ethers.provider.getSigner(STRATEGY_OWNER);
      // expect(signer).to.not.be.null;

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

      await underlying.mint(farmerAddress, farmerBalance, { from: governanceAddress });
      const underlyingBalanceOfFarmer = await underlying.balanceOf(farmerAddress);
      expect(farmerBalance).to.be.equal(underlyingBalanceOfFarmer.toString());

      Vault = await ethers.getContractFactory("Vault");

      vaultProxyInst = await upgrades.deployProxy(Vault, 
      [storageInstance.address, underlying.address, 100, 100, totalSupplyCap],
       {
         initializer: 'initializeVault(address,address,uint256,uint256,uint256)', 
         unsafeAllow: ['constructor'],
         unsafeAllowCustomTypes: true
         //,from: governance
      });

      vaultProxyAddress = vaultProxyInst.address;
      console.log(`Vault is deployed with proxy-address: ${vaultProxyAddress}`);

      vaultImplementationAddress = await getImplementationAddress(network.provider, vaultProxyAddress);
      console.log(`Vault Proxy has implementation: ${vaultImplementationAddress}`)
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
            //,from: governanceAddress
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
            //,from: governanceAddress
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
          //,from: governance
        });
      
      const vaultUpgradedImplementationAddress = await getImplementationAddress(network.provider, vaultProxyAddress);
      console.log(`Vault Proxy  upgraded has implementation: ${vaultUpgradedImplementationAddress}`);

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
