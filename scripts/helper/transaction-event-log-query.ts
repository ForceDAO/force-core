import "@nomiclabs/hardhat-ethers";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { EthereumProvider } from '@openzeppelin/upgrades-core';

export const getImplementationAddressOfProxy = async (provider: EthereumProvider, proxyAddress: string) : Promise<string> => {
  return await getImplementationAddress(provider, proxyAddress);
};

export const getVaultImplementationFromTransactionHash = async (transactionHash : string, hre: any) : Promise<string> => { 
  const implementationAddressTopicHash = hre.ethers.utils.keccak256(hre.ethers.utils.solidityPack(["string"], ["Upgraded(address)"]));

  //lookup for implementationAddress in EventLog which has topic-0 matching implementationAddressTopicHash
  const transactionReceipt = await hre.ethers.provider.getTransactionReceipt(transactionHash);

  // refer: https://polygonscan.com/tx/0x254f4579f70c751752f8d6ebd0b5a0420388c3e75fe94272ed5757608bf0263c#eventlog

  const logs = transactionReceipt.logs;
  const logIndex = logs.length;

  for(let i =  0 ; i < logIndex; i++){
   
      let log = logs[i];

      if(log.topics[0] == implementationAddressTopicHash){
          const implementationAddressHex : string = log.topics[1];
          return implementationAddressHex.replace("0x000000000000000000000000", "0x");
      }
  }
  
  throw new Error("Failed to query implementation-Address");
};
