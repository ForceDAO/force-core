//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../hardworkInterface/IStrategy.sol";
import "../hardworkInterface/IController.sol";
import "../hardworkInterface/IVault.sol";
import "../Governable.sol";
import "../Controllable.sol";

abstract contract NoopVault is ERC20, IVault, Controllable {
  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  event Withdraw(address indexed beneficiary, uint256 amount);
  event Deposit(address indexed beneficiary, uint256 amount);
  event Invest(uint256 amount);

  IStrategy public strategyIStrategy;
  IERC20 public underlyingIERC20;

  IStrategy[] public strategies;

  uint256 underlyingUnit;

  mapping(address => uint256) contributions;
  mapping(address => uint256) withdrawals;

  // how much was deposited in total using the deposit() method
  // note this would be different from the actual balance
  uint256 public totalUnderlyingDeposited = 0;

  uint256 vaultFractionToInvestNumerator = 9500; // investing 95% of the vault
  uint256 vaultFractionToInvestDenominator = 10000;

  constructor(address _storage,
      address _underlying,
      uint256 _toInvestNumerator,
      uint256 _toInvestDenominator
  ) ERC20(
    string(abi.encodePacked("Chad_", ERC20(_underlying).name())),
    string(abi.encodePacked("chad", ERC20(_underlying).symbol()))
  ) Controllable(_storage) {
    underlyingIERC20 = IERC20(_underlying);
    require(_toInvestNumerator <= _toInvestDenominator, "cannot invest more than 100%");
    require(_toInvestDenominator != 0, "cannot divide by 0");
    vaultFractionToInvestDenominator = _toInvestDenominator;
    vaultFractionToInvestNumerator = _toInvestNumerator;
    underlyingUnit = 10 ** uint256(ERC20(address(underlyingIERC20)).decimals());
  }

  function controller() public view override(IVault, Controllable) returns (address) {
    return Storage(store).controller();
  }
  function governance() public view override(IVault, Governable) returns (address) {
    return Storage(store).governance();
  }
  function addStrategy(address _strategy) public {
  }

  function removeStrategy(address _strategy) public {
  }

  function getNumberOfStrategies() public view returns(uint256) {
    return 0;
  }

  function bestStrategy() public view returns(IStrategy) {
    return IStrategy(address(0));
  }

  function doHardWork() external override {
  }

  function underlyingBalanceInVault() view public override returns (uint256) {
    return underlyingIERC20.balanceOf(address(this));
  }

  function underlyingBalanceWithInvestment() view public override returns (uint256) {
    return underlyingBalanceInVault();
  }

  /*
  * Allows for getting the total contributions ever made.
  */
  function getContributions(address holder) view public returns (uint256) {
    return contributions[holder];
  }

  /*
  * Allows for getting the total withdrawals ever made.
  */
  function getWithdrawals(address holder) view public returns (uint256) {
    return withdrawals[holder];
  }

  function getPricePerFullShare() public view override returns (uint256) {
    return totalSupply() == 0
        ? underlyingUnit
        : underlyingUnit.mul(underlyingBalanceWithInvestment()).div(totalSupply());
  }

  /* get the user's share (in underlyingIERC20)
  */
  function underlyingBalanceWithInvestmentForHolder(address holder) view external override returns (uint256) {
    if (totalSupply() == 0) {
      return 0;
    }
    return underlyingBalanceWithInvestment()
        .mul(balanceOf(holder))
        .div(totalSupply());
  }

  function strategyExists(address _strategy) public view returns(bool) {
    return false;
  }

  function setStrategy(address _strategy) public override {
  }

  function setVaultFractionToInvest(uint256 numerator, uint256 denominator) external onlyGovernance override {
    require(denominator > 0, "denominator must be greater than 0");
    require(numerator <= denominator, "denominator must be greater than or equal to numerator");
    vaultFractionToInvestNumerator = numerator;
    vaultFractionToInvestDenominator = denominator;
  }

  function availableToInvestOut() public view returns (uint256) {
    return 0;
  }

  function invest() public {
  }

  function deposit(uint256 amount) external override {
    _deposit(amount, msg.sender, msg.sender);
  }

  function depositFor(uint256 amount, address holder) public override {
    _deposit(amount, msg.sender, holder);
  }

  function withdrawAll() external override {
  }

  function withdraw(uint256 numberOfShares) external override {
    require(totalSupply() > 0, "Vault has no shares");
    require(numberOfShares > 0, "numberOfShares must be greater than 0");

    uint256 underlyingAmountToWithdraw = underlyingBalanceWithInvestment()
        .mul(numberOfShares)
        .div(totalSupply());

    if (underlyingAmountToWithdraw > underlyingBalanceInVault()) {
      // withdraw everything from the strategy to accurately check the share value
      uint256 missing = underlyingAmountToWithdraw.sub(underlyingBalanceInVault());
      strategyIStrategy.withdrawToVault(missing);
      // recalculate to improve accuracy
      underlyingAmountToWithdraw = Math.min(underlyingBalanceWithInvestment()
          .mul(numberOfShares)
          .div(totalSupply()), underlyingIERC20.balanceOf(address(this)));
    }

    _burn(msg.sender, numberOfShares);

    underlyingIERC20.safeTransfer(msg.sender, underlyingAmountToWithdraw);

    // update the withdrawal amount for the holder
    withdrawals[msg.sender] = withdrawals[msg.sender].add(underlyingAmountToWithdraw);
    emit Withdraw(msg.sender, underlyingAmountToWithdraw);
  }

  function _deposit(uint256 amount, address sender, address beneficiary) internal {
    require(amount > 0, "Cannot deposit 0");
    require(beneficiary != address(0), "holder must be defined");

    uint256 toMint = totalSupply() == 0
        ? amount
        : amount.mul(totalSupply()).div(underlyingBalanceWithInvestment());
    _mint(beneficiary, toMint);

    uint256 oldActualBalance = underlyingBalanceInVault();
    underlyingIERC20.safeTransferFrom(sender, address(this), amount);

    // confirm a successful transfer
    assert(underlyingBalanceInVault().sub(amount) >= oldActualBalance);
    totalUnderlyingDeposited = totalUnderlyingDeposited.add(amount);

    // update the contribution amount for the beneficiary
    contributions[beneficiary] = contributions[beneficiary].add(amount);
    emit Deposit(beneficiary, amount);
  }
}
