//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./strategiesCurveInterfaces/Gauge.sol";

contract MockMintr is Mintr {
  function mint(address a) external override {}
}
