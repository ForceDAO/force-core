//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface yERC20 {
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function getPricePerFullShare() external view returns (uint256);
}
