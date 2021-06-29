//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../Vault.sol";

contract MockUpgradedVault is Vault {
  
   function getTrue() external pure returns (bool) {
     return true;
   }

}