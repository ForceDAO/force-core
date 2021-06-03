//npx hardhat balance --account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (args, hre) => {
    const account = await hre.ethers.utils.getAddress(args.account);
    const balance = await hre.ethers.provider.getBalance(account);
    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });

module.exports;
/*
*/
