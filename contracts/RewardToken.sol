//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./Governable.sol";

contract RewardToken is ERC20, ERC20Capped, ERC20PresetMinterPauser, Governable {

  uint256 public constant HARD_CAP = 5 * (10 ** 6) * (10 ** 18);

  constructor(address _storage)
  ERC20PresetMinterPauser("FARM Reward Token", "FARM")
  ERC20Capped(HARD_CAP)
  Governable(_storage) {
    // msg.sender should not be a minter
    renounceRole(MINTER_ROLE, msg.sender);

    // governance will become the only minter
    _setupRole(MINTER_ROLE, governance());
  }

  /**
  * Overrides adding new minters so that only governance can authorized them.
  */
  function addMinter(address _minter) public onlyGovernance {
    super._setupRole(MINTER_ROLE, _minter);
  }
  
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20PresetMinterPauser) { }

  function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
    require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
    super._mint(account, amount);
  }
}
