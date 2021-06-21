//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract MockUniswap {

  constructor() {
  }

  function swapExactTokensForTokens(
    uint256 balance,
    uint256 amountOutMin,
    address[] calldata path,
    address recipient,
    uint256 expiry
  ) external returns (uint[] memory amounts) {}
}
