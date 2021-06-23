const { ethers, upgrades } = require("hardhat");
const { expect, use } = require("chai");
const chaiAlmost = require("chai-almost");
const PMFTC = require("../../polygon-mainnet-fork-test-config.js");
use(chaiAlmost());

const checkAlmostSame = (a, b) => {
  expect(ethers.BigNumber.from(a).gt(ethers.BigNumber.from(b).mul(99).div(100))).to.be.true;
  expect(ethers.BigNumber.from(a).lt(ethers.BigNumber.from(b).mul(101).div(100))).to.be.true;
};

const units = (value) => ethers.utils.parseUnits(value.toString());

// For mainnet fork tests
const wmatic = PMFTC.WMATIC_ADDRESS;
const force = PMFTC.FORCE_ADDRESS;
const sushi = PMFTC.SUSHI_ADDRESS;
const usdc = PMFTC.USDC_ADDRESS;
const usdt = PMFTC.USDT_ADDRESS;
const ZERO_ADDRESS = PMFTC.ZERO_ADDRESS;
const masterChefHodlStrategyAddress = PMFTC.MASTER_CHEF_HODL_STRATEGY_ADDRESS;
const strategyOwner = PMFTC.STRATEGY_OWNER;
const sushiswapV2Router = PMFTC.SUSHISWAP_V2_ROUTER02_ADDRESS;

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
    let WMatic, WETH, USDC, USDT;
    let logicOwner, dao, user;
    before(async function () {
    [user] = await ethers.getSigners();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [strategyOwner]}
    );
    
  });

  it("masterChefHodlStrategy should have WMatic routes initialised", async () => {
    const signer = await ethers.provider.getSigner("0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6");
    expect(signer).to.not.be.null; 
    let strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", masterChefHodlStrategyAddress);
    expect(strategyInstance).to.not.be.null; 

    let routes = await strategyInstance.getWmaticRoutes();
    expect(routes).to.not.be.null;
    console.log(`routes from strategy are: ${routes}`); 
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
