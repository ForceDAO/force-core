//npx hardhat balance --account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
// task("balance2", "Prints an account's balance")
//   .addParam("account", "The account's address")
//   .setAction(async (args: { account: any; }, hre: { ethers: { utils: { getAddress: (arg0: any) => any; formatEther: (arg0: any) => any; }; provider: { getBalance: (arg0: any) => any; }; }; }) => {
//     const account = await hre.ethers.utils.getAddress(args.account);
//     const balance = await hre.ethers.provider.getBalance(account);
//     console.log(hre.ethers.utils.formatEther(balance), "ETH");
//   });

module.exports;

function task(arg0: string, arg1: string): Promise<any> {
  return new Promise(async(resolve,reject)=>{
    console.log("here1")
  });
}
/*---------------------==
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (args, hre) => {
    const account = await hre.ethers.utils.getAddress(args.account);
    const balance = await hre.ethers.provider.getBalance(account);
    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  });

module.exports;

*/
