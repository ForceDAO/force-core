import "@nomiclabs/hardhat-ethers";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { EthereumProvider } from '@openzeppelin/upgrades-core';

export const getImplementationAddressOfProxy = async (provider: EthereumProvider, proxyAddress: string) : Promise<string> => {
  return await getImplementationAddress(provider, proxyAddress);
};

export const getStrategyImplementationFromTransactionHash = async (transactionHash : string, hre: any) : Promise<string> => { 
  const implementationAddressTopicHash = hre.ethers.utils.keccak256(hre.ethers.utils.solidityPack(["string"], ["LogSushiHodlStrategyCreated(address)"]));

  //lookup for implementationAddress in EventLog which has topic-0 matching implementationAddressTopicHash
  const transactionReceipt = await hre.ethers.provider.getTransactionReceipt(transactionHash);

  // refer: https://polygonscan.com/tx/0xa26c75511da1987801bb2a7b78dd076707ba1ad0b85ad1e3cc2da122ab108b64#eventlog

  const logs = transactionReceipt.logs;
  const logIndex = logs.length;

  for(let i =  0 ; i < logIndex; i++){
   
      let log = logs[i];

      if(log.topics[0] == implementationAddressTopicHash){
          const implementationAddressHex : string = log.topics[1];
          return implementationAddressHex.replace("0x000000000000000000000000", "0x");
      }
  }
  
  throw new Error("Failed to extract Strategy-Implementation-Address");
};
