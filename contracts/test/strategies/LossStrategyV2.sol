//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../hardworkInterface/IStrategyV2.sol";
import "../../hardworkInterface/IController.sol";
import "../../Controllable.sol";
import "../../Storage.sol";
import "../../hardworkInterface/IVault.sol";

contract LossStrategyV2 is IStrategyV2, Controllable {
  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  IERC20 public underlying1;
  IVault public vault1;
  uint256 public balance;

  // These tokens cannot be claimed by the controller
  mapping (address => bool) public override unsalvagableTokens;

  constructor(address _storage, address _underlying, address _vault)
  Controllable(_storage) {
    require(_underlying != address(0), "_underlying cannot be empty");
    require(_vault != address(0), "_vault cannot be empty");
    underlying1 = IERC20(_underlying);
    vault1 = IVault(_vault);
  }

  function governance() public view override(IStrategyV2, Governable) returns (address) {
    return store.governance();
  }
  function controller() public view override(IStrategyV2, Controllable) returns (address) {
    return store.controller();
  }
  function underlying() external view override returns (address){
    return address(underlying1);
  }
  function vault() external view override returns (address){
    return address(vault1);
  }

  function depositArbCheck() public pure override returns(bool) {
    return true;
  }

  modifier onlyVault() {
    require(msg.sender == address(vault1), "The caller must be the vault");
    _;
  }

  modifier restricted() {
    require(msg.sender == address(vault1) || msg.sender == address(controller()),
      "The sender has to be the controller or vault");
    _;
  }

  /*
  * Returns the total invested amount.
  */
  function investedUnderlyingBalance() view public override returns (uint256) {
    // for real strategies, need to calculate the invested balance
    return underlying1.balanceOf(address(this));
  }

  /*
  * Invests all tokens that were accumulated so far
  */
  function investAllUnderlying() public {
    // get rid of 10% forever
    uint256 contribution = underlying1.balanceOf(address(this)).sub(balance);
    underlying1.transfer(address(1), contribution.div(10));
    balance = underlying1.balanceOf(address(this));
  }

  /*
  * Cashes everything out and withdraws to the vault
  */
  function withdrawAllToVault() external restricted override {
    underlying1.safeTransfer(address(vault1), underlying1.balanceOf(address(this)));
    balance = underlying1.balanceOf(address(this));
  }

  /*
  * Cashes some amount out and withdraws to the vault
  */
  function withdrawToVault(uint256 shares, uint256 totalShares) external restricted override {
    uint256 amount = underlying1.balanceOf(address(this)).mul(shares).div(totalShares);
    underlying1.safeTransfer(address(vault1), amount);
    balance = underlying1.balanceOf(address(this));
  }

  /*
  * Honest harvesting. It's not much, but it pays off
  */
  function doHardWork() external onlyVault override {
    // a no-op
    investAllUnderlying();
  }

  // should only be called by controller
  function salvage(address destination, address token, uint256 amount) external onlyController override {
    IERC20(token).safeTransfer(destination, amount);
  }
}
