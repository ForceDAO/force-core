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

describe("MasterChefV2 - Vault mainnet fork Tests", function () {
    let WMatic, WETH, USDC, USDT;
    let logicOwner, dao, user;
    before(async function () {
    [user] = await ethers.getSigners();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [strategyOwner]}
    );
    
  });

  it("masterChefHodlStrategy - vault should be initialised with valid Underlying");
  
});
