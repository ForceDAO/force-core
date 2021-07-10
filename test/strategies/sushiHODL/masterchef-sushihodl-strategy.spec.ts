import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { WMATIC_ADDRESS, FORCE_ADDRESS, SUSHI_ADDRESS,
         USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS, MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT, 
         STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS,
          SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT, SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0,
           SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1, SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0, 
           SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1} 
         from "../../polygon-mainnet-fork-test-config";
         
import { Logger } from "tslog";
const logger: Logger = new Logger();

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

        //deploy Storage

        //deploy Vault

        //deploy Factory

        // create Strategy

        strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
    });

    describe("verify Strategy Initialization", () => {

      it("WMatic routes ", async () => {
        const wMaticRoutes = await strategyInstance.getWmaticRoutes();
        expect(wMaticRoutes[0]).to.have.members(SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0);
        expect(wMaticRoutes[1]).to.have.members(SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1);
      });

      it("Sushi routes ", async () => {
        const sushiRoutes = await strategyInstance.getSushiRoutes();
        expect(sushiRoutes[0]).to.have.members(SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0);
        expect(sushiRoutes[1]).to.have.members(SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1);
      });

      it("depositArbCheck", async () => {
        const depositArbCheck = await strategyInstance.depositArbCheck();
        expect(depositArbCheck).to.be.true;
      });

      it("governanceAddress ", async () => {
        const governanceAddress = await strategyInstance.governance();
        expect(governanceAddress).to.equal(STRATEGY_OWNER);
      });

      it("governanceAddress ", async () => {
        const controllerAddress = await strategyInstance.controller();
        expect(controllerAddress).to.equal(ZERO_ADDRESS);
      });

      it("underlyingAddress ", async () => {
        const underlyingAddress = await strategyInstance.underlying();
        expect(underlyingAddress).to.equal(SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT);
      });

      it("feeHolder ", async () => {
        const feeHolder = await strategyInstance.feeHolder();
        expect(feeHolder).to.equal(ZERO_ADDRESS);
      });

      it("should have feeBase initialised with correct Value", async () => {
        const feeBase = await strategyInstance.feeBase();
        expect(feeBase).to.not.be.null;
      });

      it("should have poolId initialised with correct Value", async () => {
        const poolId = await strategyInstance.poolId();
        expect(poolId).to.equal(8);
      });

      it("should have routerAddressV2 initialised with correct Value", async () => {
        const routerAddressV2 = await strategyInstance.routerAddressV2();
        expect(routerAddressV2).to.equal(SUSHISWAP_V2_ROUTER02_ADDRESS);
      });

      it("should have sushiTokenAddress initialised with correct Value", async () => {
        const sushiTokenAddress = await strategyInstance.sushiTokenAddress();
        expect(sushiTokenAddress.toUpperCase()).to.equal(SUSHI_ADDRESS.toUpperCase());
      });
      it("should have wmaticTokenAddress initialised with correct Value", async () => {
        const wmaticTokenAddress = await strategyInstance.wmaticTokenAddress();
        expect(wmaticTokenAddress.toUpperCase()).to.equal(WMATIC_ADDRESS.toUpperCase());
      });

      it("should have sellSushi initialised with correct Value", async () => {
        const sellSushi = await strategyInstance.sellSushi();
        expect(sellSushi).to.be.false;
      });

      it("should have sellWMatic initialised with correct Value", async () => {
        const sellWMatic = await strategyInstance.sellWMatic();
        expect(sellWMatic).to.be.false;
      });

      it("should have claimAllowed initialised with correct Value", async () => {
        const claimAllowed = await strategyInstance.claimAllowed();
        expect(claimAllowed).to.be.false;
      });

      it("should return correct Vault Address", async () => {
        let vaultAddress = await strategyInstance.getVault();
        expect(vaultAddress).to.not.be.null;
      });

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
