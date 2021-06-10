//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../hardworkInterface/IStrategyV2.sol";
import "../../Controllable.sol";
import "../../hardworkInterface/IVault.sol";


contract InterestEarningStrategy is IStrategyV2, Controllable {
  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  IERC20 public underlying1;
  IVault public vault1;

  // These tokens cannot be claimed by the controller
  mapping(address => bool) public override unsalvagableTokens;

  // for unit tests of the withdraw logic
  uint256 public test_sharesWithdraw;
  uint256 public test_amountWithdraw;
  uint256 public test_sharesTotalWithdraw;

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

  /*
  * Returns the total invested amount.
  */
  function investedUnderlyingBalance() public view override returns (uint256) {
    // for real strategies, need to calculate the invested balance
    return underlying1.balanceOf(address(this));
  }

  /*
  * Invests all tokens that were accumulated so far
  */
  function investAllUnderlying() public {
  }

  function addInterest() external onlyGovernance {
    // adds 5% of the total balance
    ERC20PresetMinterPauser(address(underlying1)).mint(address(this), underlying1.balanceOf(address(this)).div(20));
  }

  /*
  * Cashes everything out and withdraws to the vault
  */
  function withdrawAllToVault() external onlyVault override {
    if (underlying1.balanceOf(address(this)) > 0) {
      underlying1.safeTransfer(address(vault1), underlying1.balanceOf(address(this)));
    }
  }

  /*
  * Cashes some amount out and withdraws to the vault
  */
  function withdrawToVault(uint256 shares, uint256 sharesTotal) external onlyVault override {
    uint256 amount = underlying1.balanceOf(address(this)).mul(shares).div(sharesTotal);
    test_amountWithdraw = amount;
    test_sharesTotalWithdraw = sharesTotal;
    test_sharesWithdraw = shares;
    if (amount > 0) {
      underlying1.safeTransfer(address(vault1), amount);
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
