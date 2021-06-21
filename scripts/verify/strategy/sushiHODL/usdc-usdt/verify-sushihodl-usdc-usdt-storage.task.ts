import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as sushiHodlStrategyConfig from "../../../../deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat verify-sushihodl-usdc-usdt-storage  --network polygonmainnet
task("verify-sushihodl-usdc-usdt-storage", "Verify the sushi-HODL Strategy's Storage contract for usdc-usdt on Polygon Scan")
  .setAction(async (args, hre) => {
    
  const {
        storageAddress
    } = sushiHodlStrategyConfig.default;


  log.info("---------== verify-sushihodl-usdc-usdt-storage");

  await hre.run("verify:verify", {
    address: storageAddress
  })
});