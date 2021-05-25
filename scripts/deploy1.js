// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers;

const { logDeployment, toWei, fromWei, timeForwardInSeconds, log1, addr0 } = require("../test_fork/utils");

async function main() {
  //const deployContract = async(choice) => {
  // Hardhat always runs the compile task when running scripts with its command line interface.
  //
  // If this script is run directly using `node` you may want to call compile  manually to make sure everything is compiled
  // await hre.run('compile');
  const [owner, user1, user2, ...addrs] = await ethers.getSigners();
  log1("owner:", owner.address);
  const balance = await owner.getBalance();
  log1("owner balance:", fromWei(balance));

  let nodeUrlRpc, ctrtName, factoryCtrt, instCtrt,ctrtFilePath, contractName, tokenName, tokenSymbol, decimals, network;

  // var args = process.argv.slice(2);
  // console.log('args: ', args);
  // switch (args[0]) {
  // case 'insult':
  //     console.log(args[1], 'smells quite badly.');
  //     break;
  // case 'compliment':
  //     console.log(args[1], 'is really cool.');
  //     break;
  // default:
  //     console.log('Sorry, that is not something I know how to do.');
  // }
  // return;

  const addrStorage = "0xc2153D539cE9778e7011BdC5bA7E56aE8F87d22e"
  const addrGovernable = "0xDCf37204fEC59790fcE1331F79ff609d73Bd1eE6"
  const addrControllable = "0x5977FA5207D65655719423307b8690D045DdF31d"
  const addrERC20ARK = "0x1A9dCe212Cd804A7D95B28f6A9AE32861DC12221"
  const addrRewardTokenProfitNotifier  = ""
  const addrIdleTokenHelper = ""
  const addrVault = "0xEf169fbA14000463C9A9747C6Ab39750CaeBA440"
  const addrSushiMasterChefLPStrategyF1 = "0xcB42040847da4771413F219b293F5df90C797E2B"

  const addrWETH = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
  const addrUSDC = "0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5"
  const addrUniswap = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  const addrIdleToken = "0xE78c335B8a5487a9F3856cf5d173523494b3A4EA"
  const addrIdleUnderlying = "0x50D6350D2167BAd558c2Ee195c664030505ffcE0"
  const addrCompToken = "0x61460874a7196d6a22D1eE4922473664b3E95270"

  const networkID = process.env.NETWORKID;
  const choice = parseInt(process.env.FUNCTIONCHOICE);
  if(networkID === "4"){
    network = "rinkeby";
  } else if(networkID === "42"){
    network = "kovan";
  } else if(networkID === "137"){
    network = "polygonmainnet";
  } else if(networkID === "80001"){
    network = "polygonmumbai";
  } else {
    log1("networkID invalid");
    process.exit(1);
  }
  //missing constructor argument => reason: 'network does not support ENS',
  log1("choice:", choice, "\nNetworkID:", networkID, ", network:", network);

  //yarn run deploy:x:polygonmumbai
  if(choice === 1){
    ctrtName = "Storage";
    ctrtFilePath = "Storage";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(`contracts/${ctrtFilePath}.sol:${ctrtName}`);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );//npx hardhat verify --contract contracts/Storage.sol:Storage --network ${network} 0x75c8...

  } else if(choice === 2){
    ctrtName = "Governable";
    ctrtFilePath = "Governable";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(addrStorage);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${addrStorage}`
    );

  } else if(choice === 3){
    ctrtName = "Controllable";
    ctrtFilePath = "Controllable";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(addrStorage);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${addrStorage}`
    );
  
  } else if(choice === 4){
    ctrtName = "RewardTokenProfitNotifier";
    ctrtFilePath = "strategies/upgradability";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(addrStorage, addrERC20ARK);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${addrStorage} ${addrERC20ARK}`
    );

  } else if(choice === 5){
    ctrtName = "IdleTokenHelper";
    ctrtFilePath = "strategies/idleTokenHelper";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );
  } else if(choice === 6){
    ctrtName = "IdleTokenHelper";
    ctrtFilePath = "strategies/idleTokenHelper";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );
  } else if(choice === 7){
    //ProviderError: The execution failed due to an exception.
    //flattener -> Remix to deploy
    //0xEf169fbA14000463C9A9747C6Ab39750CaeBA440 Kovan
    if(1===1){
      ctrtName = "VaultF1"
      ctrtFilePath = "VaultF1";//.sol omitted
    } else {
      ctrtName = "Vault";
      ctrtFilePath = "Vault";//.sol omitted
    }
    log1("ctrtName:", ctrtName)
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contractsFlat/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );
  } else if(choice === 8){
  } else if(choice === 9){
  } else if(choice === 10){
    ctrtName = "ERC20PresetFixedSupply";
    ctrtFilePath = "ERC20PresetFixedSupply";//.sol omitted
    tokenName = "IDLE_FAKE";
    tokenSymbol = "IDLE_FAKE";
    decimals = 18;
    log1("ctrtName:", ctrtName)
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(tokenName, tokenSymbol, decimals);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${tokenName} ${tokenSymbol} ${decimals}`
    ); 
  } else if(choice === 11){


  } else if(choice === 12){
  } else if(choice === 13){
  } else if(choice === 14){
  } else if(choice === 15){
  } else if(choice === 16){

  } else if(choice === 17){
    ctrtName = "IdleStrategyUSDCKovan";
    ctrtFilePath = "strategies/idle/IdleStrategyUSDCKovan";//.sol omitted
    const addrStorage1 = addrStorage;
    const addrVault1 = addrVault;
    log1("ctrtName:", ctrtName)
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(addrStorage1, addrVault1);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${addrStorage1} ${addrVault1}`
    );
  } else if(choice === 18){

  } else if(choice === 19){
    
  } else if(choice === 21){
    // yarn run deploy:x:kovan
    //ProviderError: The execution failed due to an exception.
    //Remix deploy success!
    if(1===2){
      ctrtName = "SushiMasterChefLPStrategy";
    } else {
      ctrtName = "SushiMasterChefLPStrategyF1";//same as filename
    }
    log1("ctrtName:", ctrtName)
    ctrtFilePath = "strategies/sushiswap/SushiMasterChefLPStrategy";//.sol omitted
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );

  } else if(choice === 22){
    //Success!
    ctrtName = "CRVStrategy3PoolKovan";
    ctrtFilePath = "strategies/curve/CRVStrategy3PoolKovan";//.sol omitted
    const addrStorage1 = addrStorage;
    const addrVault1 = addrVault;
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy(addrStorage1, addrVault1);
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address} ${addrStorage1} ${addrVault1}`
    );
  } else if(choice === 31){
    contractName = "IdleStrategyUSDCMainnet"
    contractPath = "strategies/idle/IdleStrategyUSDCMainnet"
  } else if(choice === 32){
    contractName = "IdleStrategyUSDTMainnet"
    contractPath = "strategies/idle/IdleStrategyUSDTMainnet"
  } else if(choice === 33){
    contractName = "IdleStrategyDAIMainnet"
    contractPath = "strategies/idle/IdleStrategyDAIMainnet"

  } else if(choice === 41){//Rinkeby
    ctrtName = "SushiHodlStrategyRinkeby_DAI_WETH";
    ctrtFilePath = "sushiHODL/SushiHodlStrategyRinkeby_DAI_WETH";//.sol omitted
    // const addrStorage1 = "0xB1A1D3f737726A6eED2fa2157ec5dFad39cbC156";
    // const addrVault1 = "0xef7f930B7aABd8F652202B51433582E1139A02e3";
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );

  } else if(choice === 42){
    ctrtName = "SushiHodlStrategyPolygonMumbai_DAI_WETH";
    ctrtFilePath = "sushiHODL/SushiHodlStrategyPolygonMumbai_DAI_WETH";//.sol omitted
    // const addrStorage1 = "0xB1A1D3f737726A6eED2fa2157ec5dFad39cbC156";
    // const addrVault1 = "0xef7f930B7aABd8F652202B51433582E1139A02e3";
    factoryCtrt = await ethers.getContractFactory(ctrtName);
    instCtrt = await factoryCtrt.deploy();
    await instCtrt.deployed();
    logDeployment(instCtrt, network);
    console.log(
      `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
    );

  } else if(choice === 43){
  } else if(choice === 44){
  } else if(choice === 45){
  } else if(choice === 46){

  } else {
    log1("choice invalid");
  }
  /*
  log1("\n--------------== Contract setup");
  entranceFeeFactorLL = await instCtrt.entranceFeeFactorLL();
  log1("entranceFeeFactorLL:", entranceFeeFactorLL.toString());
  */
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

/**

$ npx hardhat node ... JSON-RPC server http://127.0.0.1:8545/

$ npx hardhat run scripts/deploy1.js --network localhost
$ npx hardhat run scripts/changeEnv.js --network localhost

$ npx hardhat run scripts/deploy1.js --network kovan
$ npx hardhat verify --network kovan 0x123...
$ npx hardhat verify --network kovan 0x123... constructorArg1 constructorArg2 constructorArg3

$ npx hardhat run scripts/deploy1.js --network mainnet
$ npx hardhat verify --network mainnet 0x123


//-----------------==
module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  await deploy('MyContract', {
    from: deployer,
    args: ['Hello'],
    log: true,
  });
};
module.exports.tags = ['MyContract'];


can run the above in test, too
  await deployments.fixture(['MyContract'])

 * 
 */