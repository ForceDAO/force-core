import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { WMATIC_ADDRESS, FORCE_ADDRESS, SUSHI_ADDRESS,
         USDC_ADDRESS, USDT_ADDRESS, ZERO_ADDRESS, MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT, 
         STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS, SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT, SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0, SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1, SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0, SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1} 
         from "../../../polygon-mainnet-fork-test-config";
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
        strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
    });

    describe("deposit and withdraw", () => {
      
    });


  });
