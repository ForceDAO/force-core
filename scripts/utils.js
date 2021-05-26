const { BigNumber } = require("ethers");
const { ethers } = require("ethers");
//const { expect } = require('chai');
//const chalk = require('chalk');


//--------------------== logs
const log1 = console.log;
const logDeployment = (instCtrt, network) => {
  let explorerUrl = "\nhttps://"+network+".etherscan.io/address/"+instCtrt.address;
  //log1("network:", network);

  if(network === "polygonmainnet"){
    explorerUrl = "\nhttps://explorer-mainnet.maticvigil.com/address/"+instCtrt.address+"/contracts";
  } else if(network === "polygonmumbai"){
    //https://explorer-mumbai.maticvigil.com/address/0xEf169fbA14000463C9A9747C6Ab39750CaeBA440/contracts
    explorerUrl = "\nhttps://explorer-mumbai.maticvigil.com/address/"+instCtrt.address+"/contracts";
  }
  try {
    log1("Txn Hash:", instCtrt.deployTransaction.hash);
    log1("deployed instCtrt:", instCtrt.address, explorerUrl);
  } catch (err) {
    console.error("logDeployment failed:", err);
    return -1;
  }
}
/**
const logRed = (text) => console.log(chalk.red(text));
const logGreen = (text) => console.log(chalk.green(text))
const logMagenta = (text) => console.log(chalk.magentaBright(text))
const logCyan = (text) => console.log(chalk.cyanBright(text))
const logWB = (text) => console.log(chalk.white.bgBlue.bold(text))
const logGB = (text) => console.log(chalk.green.bgBlue.bold(text))

log1(chalk`
CPU: {red ${12}%}
RAM: {green ${46 / 100 * 100}%}
`);
*/
//-------------==
//const BN = web3.utils.BN;
const bigNum = (item) => BigNumber.from(item);
const dp = 18;
const base = bigNum(10).pow(dp);
//amount1 = bigNum(1285).mul(base);
const DECIMALS18 = 18;
const amt = (amount) => bigNum(amount).pow(DECIMALS18);

const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1)

//const MAX_INTEGER = new BN(2).pow(new BN(256)).sub(new BN(1));
const OptionType = { Put: 1, Call: 2 };
const addr0 = "0x0000000000000000000000000000000000000000";

//--------------------------== toWei & fromWei
const fromWei = (weiAmount, dp = 18) => ethers.utils.formatUnits(weiAmount.toString(), parseInt(dp));
//weiAmount: BN or string, dp = 6 or 18 number, output: string
//web3.utils.fromWei(weiAmount.toString(), "ether");

const toWei = (amount, dp = 18) => ethers.utils.parseUnits(amount.toString(), parseInt(dp));
//input: string, output: Bn
//web3.utils.toWei(amount.toString(), "ether");

//--------------------== JSONRPC
//timeForwardInSeconds

//--------------------== Numerical
//moveDecimalToLeft, countDecimals

//--------------------== 
module.exports = {
  logDeployment,
  BigNumber, toWei, fromWei, log1, bigNum, base, SECONDS_IN_A_DAY, 
  OptionType, addr0, 
};// MAX_INTEGER
/*
  timeForwardInSec, setAutomine, setIntervalMining
, executeAsBlock, getSnapshot, bigNum, amt, log1, executeEmptyBlock, logRed, logGreen, logWB, logGB, logMagenta, toWei, toWeiE, fromWei, fromWeiE
*/