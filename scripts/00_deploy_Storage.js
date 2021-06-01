// deploy/00_deploy_my_contract.js
/*https://hardhat.org/plugins/hardhat-deploy.html?#deploy-scripts

getNamedAccounts: 
returns a promise to an object whose keys are names and values are addresses. It is parsed from the namedAccounts configuration (see namedAccounts).

getUnnamedAccounts: 
function that return a promise to an array of accounts (which were not used in getNamedAccounts), useful for test where you want to be sure that the account is not one of the predefined one

deployments
which contains functions to access past deployments or to save new ones, as well as helpers functions.

getChainId
which return a promise for the chainId

npx hardhat deploy --tags Storage --network polygonmumbai
*/
const hre = require("hardhat");
const ethers = hre.ethers;
const { logDeployment, log1 } = require("../test_fork/utils");

const ctrtName = "Storage";
const deployer = "0xF7Cff794396F15619628625C1778FFe880ee5326";
module.exports = async ({
  getNamedAccounts, 
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  //const {deploy, log} = deployments;
  log1("-----------== deploying Storage");
  //https://hardhat.org/plugins/hardhat-deploy.html?#the-deployments-field

  //const {deployer} = await getNamedAccounts();
  //log1("deployer:", deployer);

  const [owner, user1, user2, ...addrs] = await ethers.getSigners();
  log1("owner:", owner.address);
  const balance = await owner.getBalance();
  
  log1("owner balance:", ethers.utils.formatUnits(balance.toString(), 18));

  //await ethers.getContract("ContractName");

  ctrtFilePath = "Storage";//.sol omitted
  factoryCtrt = await ethers.getContractFactory(`contracts/${ctrtFilePath}.sol:${ctrtName}`);
  instCtrt = await factoryCtrt.deploy();
  await instCtrt.deployed();
  logDeployment(instCtrt, network);
  console.log(
    `npx hardhat verify --contract contracts/${ctrtFilePath}.sol:${ctrtName} --network ${network} ${instCtrt.address}`
  );//npx hardhat verify --contract contracts/Storage.sol:Storage --network ${network} 0x75c8...


  // https://hardhat.org/plugins/hardhat-deploy.html?#deployments-deploy, the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
  /*
  const deployResult = await deploy("contracts/"+ctrtName, {
    from: deployer,
    //skipIfAlreadyDeployed: true,
    args: [],
    log: true,
  });
  if (deployResult.newlyDeployed) {
    log(
      `contract Token deployed at ${deployResult.contract.address} using ${deployResult.receipt.gasUsed} gas`
    );
  }*/
};
module.exports.tags = [ctrtName];