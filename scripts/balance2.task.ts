//npx hardhat balance2 --account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266


//-----------== cannot find name "task"
let task :{
  addParam: () => {
    setAction: ()=> void;
  }
}
// function task(arg0: string, arg1: string): any {
//   console.log("here1")
// }

function IssuerCall(setIssuerCallState: (newState: { message: string }) => void) {
  //...
}

// task("balance2", "Prints an account's balance")
//   .addParam("account", "The account's address")
//   .setAction(async (args: { account: any; }, hre: { ethers: { utils: { getAddress: (arg0: any) => any; formatEther: (arg0: any) => any; }; provider: { getBalance: (arg0: any) => any; }; }; })  => {
//     const account = await hre.ethers.utils.getAddress(args.account);
//     const balance = await hre.ethers.provider.getBalance(account);
//     console.log(hre.ethers.utils.formatEther(balance), "ETH");
//   });

//  Property 'addParam' does not exist on type 'Promise<any>'.

module.exports;

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
