const { ethers, upgrades } = require("hardhat");
const { expect, use } = require("chai");
const chaiAlmost = require("chai-almost");

use(chaiAlmost());

const checkAlmostSame = (a, b) => {
  expect(ethers.BigNumber.from(a).gt(ethers.BigNumber.from(b).mul(99).div(100))).to.be.true;
  expect(ethers.BigNumber.from(a).lt(ethers.BigNumber.from(b).mul(101).div(100))).to.be.true;
};

const units = (value) => ethers.utils.parseUnits(value.toString());

const sushiswapV2Router = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
const sushiswapFactory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";

// For mainnet fork tests
const wmatic = "0x8e07dAfa396B1b2B226367D0266e009cA1B3248d";
const force = "0x624429a012a8A935cc1110A9880B2d698587a744";
const sushi = "0x624429a012a8A935cc1110A9880B2d698587a744";
const usdc = "";
const usdt = "";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const masterChefHodlStrategyAddress = "0x8eA874C0d1cA8C7F55B1FC5A3B0603D43D6a9f9E";
const strategyOwner = "0x9782968954A2948EB5A611235b7E3D227457DeC0";
const strategyGovernance = "0x9782968954A2948EB5A611235b7E3D227457DeC0";

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
    let WMatic, WETH, USDC, USDT;
    let logicOwner, dao, user;
    before(async function () {
    [user] = await ethers.getSigners();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [strategyOwner]}
    );
    
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [strategyGovernance]}
    );

  });

  it("masterChefHodlStrategy should have all the routes initialised", async () => {
    const signer = await ethers.provider.getSigner("0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6");
    expect(signer).to.not.be.null; 
    let strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", masterChefHodlStrategyAddress);
    expect(strategyInstance).to.not.be.null; 

    let routes = await strategyInstance.getWmaticRoutes();
    expect(routes).to.not.be.null;
    console.log(`routes from strategy are: ${routes}`); 
  });
});
