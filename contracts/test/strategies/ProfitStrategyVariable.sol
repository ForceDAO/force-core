//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../hardworkInterface/IStrategy.sol";
import "../../hardworkInterface/IController.sol";
import "../../Controllable.sol";
import "../../strategies/ProfitNotifier.sol";
import "../../Storage.sol";
import "../../hardworkInterface/IVault.sol";

abstract contract ProfitStrategyVariable is ProfitNotifier {//IStrategy
  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  IERC20 public underlyingToken;
  IVault public vaultInst;
  uint256 profitRateNumerator;
  uint256 profitRateDenominator;
  uint256 variation = 0;

  // These tokens cannot be claimed by the controller
  mapping (address => bool) public override unsalvagableTokens;

  constructor(address _storage, address _underlying, address _vault,
    uint256 _profitRateNumerator, uint256 _profitRateDenominator)
  ProfitNotifier(_storage, _underlying) {
    require(_underlying != address(0), "_underlying cannot be empty");
    require(_vault != address(0), "_vault cannot be empty");
    // We assume that this contract is a minter on underlyingToken
    underlyingToken = IERC20(_underlying);
    vaultInst = IVault(_vault);
    profitRateNumerator = _profitRateNumerator;
    profitRateDenominator = _profitRateDenominator;
  }

  modifier restricted() {
    require(msg.sender == address(vaultInst) || msg.sender == address(controller()),
      "The sender has to be the controller or vault");
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
    uint256 balance = underlyingToken.balanceOf(address(this));

    variation++;
    if (variation > 4) {
      variation = 0;
    }
    // add x% to this strategy
    // We assume that this contract is a minter on underlyingToken
    ERC20PresetMinterPauser(address(underlyingToken)).mint(address(this),
      balance.mul(profitRateNumerator + variation).div(profitRateDenominator));

  }

  /*
  * Cashes everything out and withdraws to the vault
  */
  function withdrawAllToVault() external restricted override {
    underlyingToken.safeTransfer(address(vaultInst), underlyingToken.balanceOf(address(this)));
  }

  /*
  * Cashes some amount out and withdraws to the vault
  */
  function withdrawToVault(uint256 amount) external restricted override {
    underlyingToken.safeTransfer(address(vaultInst), amount);
  }

  /*
  * Honest harvesting. It's not much, but it pays off
  */
  function doHardWork() external restricted override {
    investAllUnderlying();
  }

  // should only be called by controller
  function salvage(address destination, address token, uint256 amount) external onlyController override {
    IERC20(token).safeTransfer(destination, amount);
  }

  function depositArbCheck() public pure override returns(bool) {
    return true;
  }
}
