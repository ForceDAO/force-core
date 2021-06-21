//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NoopYVault is ERC20Burnable, ERC20PresetMinterPauser {

  IERC20 underlying;

  constructor(address _underlying) ERC20PresetMinterPauser("Mock Token", "MOCK") {
    underlying = IERC20(_underlying);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20PresetMinterPauser) { }

  function deposit(uint256 _amount) external {
    underlying.transferFrom(msg.sender, address(this), _amount);
    _mint(msg.sender, _amount);
  }

  event GG(string s, uint256 v);

  function withdraw(uint256 _amount) external {
    emit GG("withdrawing", _amount);
    burn(_amount);
    underlying.transfer(msg.sender, _amount);
  }

  function getPricePerFullShare() public pure returns(uint256) {
    return 1000000000000000000;
  }
}
