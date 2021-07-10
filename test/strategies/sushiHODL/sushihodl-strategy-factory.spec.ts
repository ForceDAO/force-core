import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { STRATEGY_OWNER, SUSHI_HODL_FACTORY_ADDRESS } from "../../polygon-mainnet-fork-test-config";

describe("MasterChefV2 - USDC_USDT mainnet fork Tests", function () {
  let logicOwner, dao, user;
  before(async function () {
    [user] = await ethers.getSigners();

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [STRATEGY_OWNER]}
    );
  });

  it("should create a new Strategy", async () => {
    const signer = await ethers.provider.getSigner(STRATEGY_OWNER);
    expect(signer).to.not.be.null; 

    let sushiHODLstrategyFactoryInstance = await ethers.getContractAt("SushiHodlStrategyFactory", SUSHI_HODL_FACTORY_ADDRESS);
    expect(sushiHODLstrategyFactoryInstance).to.not.be.null; 
  });
});
