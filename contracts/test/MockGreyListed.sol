//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../hardworkInterface/IVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockWhiteListed {

  address public vault;

  constructor(address _vault) {
    vault = _vault;
  }

  function deposit(address _token, uint256 _amount) public {
    IERC20(_token).approve(vault, _amount);
    IVault(vault).deposit(_amount);
  }
}
