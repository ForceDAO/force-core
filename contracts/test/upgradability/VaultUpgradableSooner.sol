//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VaultV2.sol";

contract VaultUpgradableSooner is VaultV2 {

  constructor() VaultV2() {}

  function overrideNextImplementationDelay(uint256 _nextImplementationDelay) public {
    _setNextImplementationDelay(_nextImplementationDelay);
  }
}
