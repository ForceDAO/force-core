//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Governable.sol";

contract Controllable is Governable {

  constructor(address _storage) Governable(_storage) {
  }

  modifier onlyController() {
    require(store.isController(msg.sender), "Not a controller");
    _;
  }

  modifier onlyControllerOrGovernance(){
    require((store.isController(msg.sender) || store.isGovernance(msg.sender)),
      "The caller must be controller or governance");
    _;
  }

  function controller() public view virtual returns (address) {
    return store.controller();
  }
}
