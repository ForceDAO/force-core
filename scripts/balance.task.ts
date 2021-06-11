//npx hardhat balance2  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 --show-stack-traces 

import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Logger } from "tslog";
const log: Logger = new Logger();

task("balance", "query balance of an Account")
  .addPositionalParam(
        "address",
        "addressArg",
        undefined, // default value
        types.string,
        false // isOptional
      )
  .setAction(async (args, hre) => {
    const account = await hre.ethers.utils.getAddress(args.address);
    const balance = await hre.ethers.provider.getBalance(account);
    log.info(hre.ethers.utils.formatEther(balance), "ETH");
  });

module.exports;