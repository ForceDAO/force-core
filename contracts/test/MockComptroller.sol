//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockComptroller {
  constructor() {
  }

  function enterMarkets(address[] memory ctokens) public pure returns(uint[] memory){
    return new uint[](1);
  }

  function markets(address ctoken) public pure returns (bool, uint256) {
    // got from compound for cusdc
    return (true, 750000000000000000);
  }

  function compSpeeds(address ctoken) external pure returns (uint256) {
    // got from compound for cusdc
    return 13416296358152430;
  }

  function claimComp(address recipient) external {}
}
