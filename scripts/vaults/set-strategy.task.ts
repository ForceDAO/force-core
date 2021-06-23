import { task, types } from "hardhat/config";
import { Logger } from "tslog";
import "@nomiclabs/hardhat-ethers";
const log: Logger = new Logger();
import * as deployConfig from "./config/deploy-config";
import { strict as assert } from 'assert';

task("set-strategy", "sets strategy to the Vault")
  .setAction(async (args, hre) => {

});