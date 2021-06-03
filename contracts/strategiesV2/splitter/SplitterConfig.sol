//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SplitterConfig {

  address[] public activeStrategies;
  uint256[] public investmentRatioNumerators;

  address public splitter;

  constructor(
    address _splitter
  ) {
    require(_splitter != address(0), "spliiter cannot be 0x0");
    splitter = _splitter;
  }

  modifier restricted() {
    require(msg.sender == splitter, "The sender has to be the splitter");
    _;
  }

  function activeStrategiesLength() public view returns (uint256) {
    return activeStrategies.length;
  }

  function pushState(
    address[] memory _activeStrategies,
    uint256[] memory _investmentRatioNumerators
  ) public restricted {
    delete activeStrategies;
    delete investmentRatioNumerators;
    for (uint256 i = 0; i < _activeStrategies.length; i++) {
      activeStrategies.push(_activeStrategies[i]);
      investmentRatioNumerators.push(_investmentRatioNumerators[i]);
    }
  }
}
