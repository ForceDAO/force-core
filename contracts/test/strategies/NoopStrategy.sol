//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../hardworkInterface/IStrategy.sol";
import "../../Controllable.sol";
import "../../hardworkInterface/IVault.sol";

abstract contract NoopStrategy is IStrategy, Controllable {
  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  IERC20 public underlyingToken;
  IVault public vaultInst;

  // These tokens cannot be claimed by the controller
  mapping(address => bool) public override unsalvagableTokens;

  bool public withdrawAllCalled = false;

  constructor(address _storage, address _underlying, address _vault)
  Controllable(_storage) {
    require(_underlying != address(0), "_underlying cannot be empty");
    require(_vault != address(0), "_vault cannot be empty");
    underlyingToken = IERC20(_underlying);
    vaultInst = IVault(_vault);
  }
  function controller() public view override(IStrategy,Controllable) returns (address) {
    return Storage(store).controller();
  }
  function governance() public view override(IStrategy,Governable) returns (address) {
    return Storage(store).governance();
  }
  function depositArbCheck() public pure override returns(bool) {
    return true;
  }

  modifier onlyVault() {
    require(msg.sender == address(vaultInst), "The caller must be the vault");
    _;
  }

  /*
  * Returns the total invested amount.
  */
  function investedUnderlyingBalance() public view override returns (uint256) {
    // for real strategies, need to calculate the invested balance
    return underlyingToken.balanceOf(address(this));
  }

  /*
  * Invests all tokens that were accumulated so far
  */
  function investAllUnderlying() public {
  }

  /*
  * Cashes everything out and withdraws to the vault
  */
  function withdrawAllToVault() external onlyVault override {
    withdrawAllCalled = true;
    if (underlyingToken.balanceOf(address(this)) > 0) {
      underlyingToken.safeTransfer(address(vaultInst), underlyingToken.balanceOf(address(this)));
    }
  }

  /*
  * Cashes some amount out and withdraws to the vault
  */
  function withdrawToVault(uint256 amount) external onlyVault override {
    if (amount > 0) {
      underlyingToken.safeTransfer(address(vaultInst), amount);
    }
  }

  /*
  * Honest harvesting. It's not much, but it pays off
  */
  function doHardWork() external onlyVault override {
    // a no-op
  }

  // should only be called by controller
  function salvage(address destination, address token, uint256 amount) external onlyController override {
    IERC20(token).safeTransfer(destination, amount);
  }
}
