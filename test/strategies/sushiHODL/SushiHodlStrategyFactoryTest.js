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

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
    let WMatic, WETH, USDC, USDT;
    let logicOwner, manager, dao, user;
    let PoolFactory, PoolLogic, PoolManagerLogic;
    let poolFactory, poolLogic, poolManagerLogic, poolLogicProxy, poolManagerLogicProxy, fundAddress;

    before(async function () {
    [owner, governance, user] = await ethers.getSigners();
    
    const masterChefHodlStrategy = await ethers.getContractFactory("MasterChefHodlStrategy");
    uniswapV2RouterGuard = await UniswapV2RouterGuard.deploy(sushiswapFactory);
    uniswapV2RouterGuard.deployed();
  });

  it("masterChefHodlStrategy should have all the routes initialised");


}