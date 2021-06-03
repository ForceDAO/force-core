//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Vault.sol";

contract VaultStrategySwitchLock is Vault {

  function setStrategy(address _strategy) public view onlyControllerOrGovernance override {
    revert("Strategy change not allowed");
  }
}
