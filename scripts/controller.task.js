//npx hardhat balance --account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (args, hre) => {
    const account = await hre.ethers.utils.getAddress(args.account);
    const balance = await hre.ethers.provider.getBalance(account);
    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });

module.exports;
// //npx hardhat deploy-controller --network polygonmumbai
// task("deploy-controller", "Deploys a new contract")
// .setAction(
//   async (args, hre) => {
//     log1("---------== deploy-controller");
//     const contractName = "controller"
//     const contractPath = "controller";//strategies/sushiHODL
//     log1("contractPath:", contractPath, ", contractName:", contractName);
//     const factoryCtrt = await hre.ethers.getContractFactory(contractName);
//     log1("check1");
//     const arg1 = process.env.STORAGE_ADDRESS || "";
//     const arg2 = process.env.FEEREWARDFORWARDER || "";
//     const instCtrt = await factoryCtrt.deploy(arg1, arg2);
//     logDeployment(instCtrt, network);

//   }
// );
