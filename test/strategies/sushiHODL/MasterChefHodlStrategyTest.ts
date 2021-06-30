import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { WMATIC_ADDRESS, FORCE_ADDRESS, SUSHI_ADDRESS,
         USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS, MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT, 
         STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS} 
         from "../../polygon-mainnet-fork-test-config";

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
    let user : any;
    let signer : any;
    let strategyInstance : any;
    before(async function () {
        [user] = await ethers.getSigners();

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [STRATEGY_OWNER]}
        );

        const signer = await ethers.provider.getSigner("0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6");
        expect(signer).to.not.be.null;
        const strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
    });

    describe("verify Strategy Initialization", () => {

      it("WMatic routes ", async () => {
        const wMaticRoutes = await strategyInstance.getWmaticRoutes();
        expect(wMaticRoutes).to.not.be.null; 
      });

      it("Sushi routes ", async () => {
        const sushiRoutes = await strategyInstance.getSushiRoutes();
        expect(sushiRoutes).to.not.be.null;
      });

      it("depositArbCheck", async () => {
        const depositArbCheck = await strategyInstance.depositArbCheck();
        expect(depositArbCheck).to.be.true;
      });

      it("governanceAddress ", async () => {
        const governanceAddress = await strategyInstance.governance();
        expect(governanceAddress).to.not.be.null;
      });

      it("governanceAddress ", async () => {
        const controllerAddress = await strategyInstance.controller();
        expect(controllerAddress).to.not.be.null;
      });

      it("underlyingAddress ", async () => {
        const underlyingAddress = await strategyInstance.underlying();
        expect(underlyingAddress).to.not.be.null;
      });


      it("feeHolder ", async () => {
        const feeHolder = await strategyInstance.feeHolder();
        expect(feeHolder).to.not.be.null;
      });

      it("should have feeBase initialised with correct Value");
      it("should have poolId initialised with correct Value");
      it("should have routerAddressV2 initialised with correct Value");
      it("should have sushiTokenAddress initialised with correct Value");
      it("should have wmaticTokenAddress initialised with correct Value");
      it("should have sellSushi initialised with correct Value");
      it("should have sellWMatic initialised with correct Value");
      it("should have claimAllowed initialised with correct Value");
      it("should return correct Vault Address");
    });

    describe("deposit and withdraw", () => {
      
    });

    describe("doHardWork", () => {

      // deposit into vault, vault deposits into strategy, strategy deposits into MiniChef
      // then fast forward 1 week
      // then: 
      it("should compound rewards after 1 week");
      it("should send controller share of profit");
    });

    describe("Governance Address", () => {
      it("should be able to update LiquidationParameters via setLiquidation");
      it("should be able to update feeRatio via setFeeHolder");
      it("should be able to update feeHolder via setFeeRatio");
    });

  });
