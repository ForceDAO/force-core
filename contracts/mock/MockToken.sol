//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockToken is ERC20Burnable, ERC20PresetMinterPauser {

  constructor() ERC20PresetMinterPauser("Mock Token", "MOCK")  {
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20PresetMinterPauser) { }
}
