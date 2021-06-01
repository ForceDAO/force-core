//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./Governable.sol";

contract Grain is ERC20, ERC20Capped, ERC20Burnable, ERC20PresetMinterPauser, Governable {

  // IOU TOKEN: 30938517.224397506697899427
  //            30939517.000000000000000000 (a buffer of 1000 IOUs)
  uint256 public constant MAX_AMOUNT = 30939517000000000000000000;

  constructor(address _storage)
  ERC20PresetMinterPauser("GRAIN Token", "GRAIN")
  ERC20Capped(MAX_AMOUNT)
  Governable(_storage) {//ERC20 decimals = 18
    // msg.sender should not be a minter

    renounceRole(MINTER_ROLE, msg.sender);
    //renounceMinter();
    // governance will become the only minter
    _setupRole(MINTER_ROLE, governance());
    //_addMinter(governance());
  }

  /**
  * Overrides adding new minters so that only governance can authorized them.
  */
  function addMinter(address _minter) public onlyGovernance {
    super._setupRole(MINTER_ROLE, _minter);// from access/accessControl.sol
    //super.addMinter(_minter);
  }
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20PresetMinterPauser) { }

  function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
    require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
    super._mint(account, amount);
  }

}
