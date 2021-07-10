//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Storage.sol";

contract Governable {

  Storage public store;

  constructor(address _store) {
    require(_store != address(0), "new storage shouldn't be empty");
    store = Storage(_store);
  }

  modifier onlyGovernance() {
    require(store.isGovernance(msg.sender), "Not governance");
    _;
  }

  function setStorage(address _store) public onlyGovernance {
    require(_store != address(0), "new storage shouldn't be empty");
    store = Storage(_store);
  }

  function governance() external view virtual returns (address) {
    return store.governance();
  }
}
