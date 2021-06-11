const BigNumberjs = require('bignumber.js');
const { time } = require("@openzeppelin/test-helpers");
BigNumberjs.config({DECIMAL_PLACES: 0});
const { BigNumber } = require("ethers");

let gasLogger = {};
let gasLoggerNum = {};

//--------------------==
const jsonrpc = "2.0";
const id = 0; //31337
const makeRPC = async (method, params = []) =>
  await network.provider.request({ id, jsonrpc, method, params });
//web3.currentProvider.makeRPC({ id, jsonrpc, method, params })

const timeForwardInSec = async (seconds) => {
  console.log("\nOn Time Forward", seconds, "seconds");
  await timeForward(Number(seconds));
};
async function waitHours (n) {
  await time.increase(n * 3600 + 1);
};

async function advanceNBlock (n) {
  let startingBlock = await time.latestBlock();
  await time.increase(15 * Math.round(n));
  let endBlock = startingBlock.addn(n);
  await time.advanceBlockTo(endBlock);
}
const getBlockTimestamp = async () => {
  const blockNum = await makeRPC("eth_blockNumber");
  const lastBlock = await makeRPC("eth_getBlockByNumber", [blockNum, true]);
  const blockTimestamp = parseInt(lastBlock.timestamp);
  console.log("blockTimestamp:", blockTimestamp);
  return blockTimestamp;
};
const getBlockTimestampBN = async() => {
  const t1 = await getBlockTimestamp();
  return BigNumber.from(t1);
}

const timeForward = async (seconds) => {
  await makeRPC("evm_increaseTime", [seconds]);
  await makeRPC("evm_mine");//manually mine new blocks 
};

// const args = getEventArgs(receipt, "ValueChanged");
// expect(args[0]).to.equal('43');
const getEventArgs = (receipt, eventName) => {
  //log1("eventArgs:", receipt.events[0].args[0].toString());
  const events = receipt.events?.filter((x) => {
    return x.event == eventName;
  });
  //log1("filtered events:", events);
  const args = events[0].args;
  //log1("args:", args);
  const out = args.map(item => {
    return item.toString();
  });
  //log1("out:", out);
  return args;
}

//--------------------==
async function gasLog(logTo, targetPromise) {
  let tx = await targetPromise;
  gasUsed = tx.receipt.gasUsed;

  if(gasLogger[logTo] == undefined) {
    gasLogger[logTo] = gasUsed;
    gasLoggerNum[logTo] = 1;
  }
  else {
    gasLogger[logTo] = (gasLogger[logTo])/(gasLoggerNum[logTo]+1) + gasUsed/(gasLoggerNum[logTo]+1);
    gasLoggerNum[logTo]++;
  }
}

async function printGasLog() {
  console.log(gasLogger);
}

async function advanceNBlock (n) {
  let startingBlock = await time.latestBlock();
  await time.increase(15 * Math.round(n));
  let endBlock = startingBlock.addn(n);
  await time.advanceBlockTo(endBlock);
}
async function waitHours (n) {
  await time.increase(n * 3600 + 1);
};

function assertBNEq(a, b){
  let _a = new BigNumberjs(a);
  let _b = new BigNumberjs(b);
  let msg = _a.toFixed() + " != " + _b.toFixed();
  assert.equal(_a.eq(_b), true, msg);
}

function assertApproxBNEq(a, b, c){
  let _a = new BigNumberjs(a).div(c);
  let _b = new BigNumberjs(b).div(c);
  let msg = _a.toFixed() + " != " + _b.toFixed();
  assert.equal(_a.eq(_b), true, msg);
}

function assertBNGt(a, b){
  let _a = new BigNumberjs(a);
  let _b = new BigNumberjs(b);
  let msg = _a.toFixed() + " is not greater than " + _b.toFixed();
  assert.equal(_a.gt(_b), true, msg);
}

function assertBNGte(a, b){
  let _a = new BigNumberjs(a);
  let _b = new BigNumberjs(b);
  let msg = _a.toFixed() + " is not greater than " + _b.toFixed();
  assert.equal(_a.gte(_b), true, msg);
}

function assertNEqBN(a, b){
  let _a = new BigNumberjs(a);
  let _b = new BigNumberjs(b);
  assert.equal(_a.eq(_b), false);
}

async function inBNfixed(a) {
  return await (new BigNumberjs(a)).toFixed();
}

module.exports = {
  timeForwardInSec, getBlockTimestamp, getBlockTimestampBN, getEventArgs,
  gasLogger,
  gasLoggerNum,
  gasLog,
  printGasLog,
  advanceNBlock,
  assertBNEq,
  assertApproxBNEq,
  assertBNGt,
  assertNEqBN,
  inBNfixed,
  waitHours,
  assertBNGte,
};
