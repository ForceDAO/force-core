
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

module.exports = {
  logDeployment, log1 
};
