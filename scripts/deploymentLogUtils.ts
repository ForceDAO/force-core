import { Logger } from "tslog";
const log: Logger = new Logger();

//--------------------== logs
export const logDeployment = (instCtrt, network) => {
  let explorerUrl = "\nhttps://"+network+".etherscan.io/address/"+instCtrt.address;
  if(network === "polygonmainnet"){
    explorerUrl = "\nhttps://explorer-mainnet.maticvigil.com/address/"+instCtrt.address+"/contracts";
  } else if(network === "polygonmumbai"){
    //https://explorer-mumbai.maticvigil.com/address/0xEf169fbA14000463C9A9747C6Ab39750CaeBA440/contracts
    explorerUrl = "\nhttps://explorer-mumbai.maticvigil.com/address/"+instCtrt.address+"/contracts";
  }
  try {
    log.info("Txn Hash:", instCtrt.deployTransaction.hash);
    log.info("deployed instCtrt:", instCtrt.address, explorerUrl);
  } catch (err) {
    log.error("logDeployment failed:", err);
    return -1;
  }
}
