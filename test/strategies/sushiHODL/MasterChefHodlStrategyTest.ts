import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { WMATIC_ADDRESS, FORCE_ADDRESS, SUSHI_ADDRESS,
         USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS, MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT, 
         STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS} 
         from "../../polygon-mainnet-fork-test-config";

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
  let logicOwner, dao, user;
  before(async function () {
    [user] = await ethers.getSigners();

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [STRATEGY_OWNER]}
    );
  });

  it("masterChefHodlStrategy should have WMatic routes initialised", async () => {
    const signer = await ethers.provider.getSigner("0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6");
    expect(signer).to.not.be.null; 

    console.log(`masterChefHodlStrategyAddress is: ${MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT}`);
    const strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
    expect(strategyInstance).to.not.be.null; 

    const feeHolder = await strategyInstance.feeHolder();
    console.log(`feeHolder from strategy are: ${feeHolder}`); 

    const depositArbCheck = await strategyInstance.depositArbCheck();
    console.log(`depositArbCheck from strategy are: ${depositArbCheck}`); 
    expect(depositArbCheck).to.be.true;
    
    const sushiRoutes = await strategyInstance.getSushiRoutes();
    console.log(`sushiRoutes from strategy are: ${sushiRoutes}`); 
    expect(sushiRoutes).to.not.be.null;

    const routes = await strategyInstance.getWmaticRoutes();
    console.log(`routes from strategy are: ${routes}`); 
    expect(routes).to.not.be.null;

  });

  it("masterChefHodlStrategy should have Sushi routes initialised");
  it("masterChefHodlStrategy should return depositArbCheck as initialised with correct value");
  it("masterChefHodlStrategy should have poolId initialised with correct Value");
  it("masterChefHodlStrategy should have routerAddressV2 initialised with correct Value");
  it("masterChefHodlStrategy should have sushiTokenAddress initialised with correct Value");
  it("masterChefHodlStrategy should have wmaticTokenAddress initialised with correct Value");
  it("masterChefHodlStrategy should have sellSushi initialised with correct Value");
  it("masterChefHodlStrategy should have sellWMatic initialised with correct Value");
  it("masterChefHodlStrategy should have claimAllowed initialised with correct Value");
  it("masterChefHodlStrategy should have feeBase initialised with correct Value");
  it("masterChefHodlStrategy should return correct Vault Address");
  it("masterChefHodlStrategy should return correct Underlying Address");
  it("masterChefHodlStrategy Governance Address should be able to update LiquidationParameters via setLiquidation");
  it("masterChefHodlStrategy Governance Address should be able to update feeRatio via setFeeHolder");
  it("masterChefHodlStrategy Governance Address should be able to update feeHolder via setFeeRatio");


});
