//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../hardworkInterface/IMigrator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockMigrator is IMigrator {
  using SafeERC20 for IERC20;
  address public strategy;
  address public newVault;

  constructor(
    address _newVault,
    address _strategy
  ) {
    newVault = _newVault;
    strategy = _strategy;
  }

  function pullFromStrategy() public override {
    IERC20(newVault).safeTransferFrom(strategy, address(this), IERC20(newVault).balanceOf(strategy));
  }
}
