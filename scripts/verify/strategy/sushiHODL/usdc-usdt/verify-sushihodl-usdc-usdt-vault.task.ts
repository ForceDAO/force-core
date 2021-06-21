import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import * as sushiHodlStrategyConfig from "../../../../deploy/strategy/sushiHODL/config/deploy-sushiHodl-USDC-USDT-polygon-mainnet-config";
import { Logger } from "tslog";
const log: Logger = new Logger();

// npx hardhat verify-sushihodl-usdc-usdt-vault  --network polygonmainnet
task("verify-sushihodl-usdc-usdt-vault", "Verify the sushi-HODL Strategy's Vault contract for USDC-USDT underlying on Polygon Scan")
  .setAction(async (args, hre) => {
    
  const {
        vaultAddress
    } = sushiHodlStrategyConfig.default;


  log.info("---------== verify-sushihodl-usdc-usdt-vault");

  await hre.run("verify:verify", {
    address: vaultAddress
  })
});