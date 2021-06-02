//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPriceConvertor {
  function yCrvToUnderlying(uint256 _token_amount, uint256 i) external view returns (uint256);
}
