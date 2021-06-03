//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../strategiesV2/splitter/SplitterStrategy.sol";


contract SplitterStrategyUpgradedTestOnly is SplitterStrategy {
  /* The order of variables is intentionally messed up here
  * in order to test upgradability
  */
  uint256 randomInt1;
  uint256[] public override investmentRatioNumerators;
  uint256 randomInt2;
  address[] public override activeStrategies;
  uint256 randomInt3;

  constructor() SplitterStrategy() {
    randomInt1 = type(uint256).max - 555;
    randomInt2 = type(uint256).max - 44444;
    randomInt3 = type(uint256).max - 111111;
  }

  function unsalvagableTokens(address token) public view override returns (bool) {
    require(randomInt1 > 0, "randomInt1");
    require(randomInt2 > 0, "randomInt2");
    require(randomInt3 > 0, "randomInt3");
    return token == underlying();
  }
}
