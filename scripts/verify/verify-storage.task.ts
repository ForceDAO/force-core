import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();
import { Logger } from "tslog";
const log: Logger = new Logger();
import { ethers } from "ethers";
import { strict as assert } from 'assert';
import { storageAddress } from "../deploy/config/deploy-config-global";

task("verify-storage", "Verify the Storage contract on Polygon Scan")
  .setAction(async (args, hre) => {
  assert(ethers.utils.getAddress(storageAddress) == storageAddress, "Cannot validate Invalid storageAddress");
  log.info("---------== verify-sushihodl-storage");

  await hre.run("verify:verify", {
    address: storageAddress
  });
});