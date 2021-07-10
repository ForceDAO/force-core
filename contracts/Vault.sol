//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./hardworkInterface/IStrategy.sol";
import "./hardworkInterface/IVault.sol";
import "./hardworkInterface/IUpgradeSource.sol";
import "./ControllableInit.sol";
import "./VaultStorage.sol";

contract Vault is ERC20Upgradeable, IVault, IUpgradeSource, ControllableInit, VaultStorage, ReentrancyGuardUpgradeable {
  using SafeERC20Upgradeable for IERC20Upgradeable;
  using AddressUpgradeable for address;
  using SafeMathUpgradeable for uint256;

  event Withdraw(address indexed beneficiary, uint256 amount);
  event Deposit(address indexed beneficiary, uint256 amount);
  event Invest(uint256 amount);
  event StrategyAnnounced(address newStrategy, uint256 time);
  event StrategyChanged(address newStrategy, address oldStrategy);

  modifier whenStrategyDefined() {
    require(address(strategy()) != address(0), "Strategy must be defined");
    _;
  }

  //  Only smart contracts will be affected by this modifier
  modifier defense() {
    require(
      (msg.sender == tx.origin) ||  // If it is a normal user and not smart contract,
                                    // then the requirement will pass
      Storage(_storage()).checkWhitelist(msg.sender), // If it is a smart contract, then
      "This smart contract is not whitelisted"        // make sure that it is on our whitelist.
    );
    _;
  }

  constructor() {
  }

  function controller() public view override(IVault, ControllableInit) returns (address) {
    return Storage(_storage()).controller();
  }

  function governance() public view override(GovernableInit,IVault) returns (address) {
    return Storage(_storage()).governance();
  }

  // the function is name differently to not cause inheritance clash in truffle and allows tests
  function initializeVault(address _storage,
    address _underlying,
    uint256 _toInvestNumerator,
    uint256 _toInvestDenominator,
    uint256 _totalSupplyCap
  ) public initializer {
    require(_storage != address(0), "Vault: cannot set 0 address");
    require(_underlying != address(0), "Vault: cannot set 0 address");
    require(_toInvestNumerator <= _toInvestDenominator, "cannot invest more than 100%");
    require(_toInvestDenominator != 0, "cannot divide by 0");

    ERC20Upgradeable.__ERC20_init(
      string(abi.encodePacked("FORCE_", ERC20Upgradeable(_underlying).symbol())),
      string(abi.encodePacked("x", ERC20Upgradeable(_underlying).symbol()))
    );
    ControllableInit.initialize(
      _storage
    );

    uint256 __underlyingUnit = 10 ** uint256(ERC20Upgradeable(address(_underlying)).decimals());
    uint256 implementationDelay = 12 hours;
    uint256 strategyChangeDelay = 12 hours;
    VaultStorage.initialize(
      _underlying,
      _toInvestNumerator,
      _toInvestDenominator,
      __underlyingUnit,
      implementationDelay,
      strategyChangeDelay,
      _totalSupplyCap
    );
  }

  function totalSupplyCap() public view returns (uint256) {
    return _totalSupplyCap();
  }

  function withdrawFee() public view returns (uint256) {
    return _withdrawFee();
  }

  function strategy() public view override returns(address) {
    return _strategy();
  }

  function underlying() public view override returns(address) {
    return _underlying();
  }

  function underlyingUnit() public view returns(uint256) {
    return _underlyingUnit();
  }

  function vaultFractionToInvestNumerator() public view returns(uint256) {
    return _vaultFractionToInvestNumerator();
  }

  function vaultFractionToInvestDenominator() public view returns(uint256) {
    return _vaultFractionToInvestDenominator();
  }

  function nextImplementation() public view returns(address) {
    return _nextImplementation();
  }

  function nextImplementationTimestamp() public view returns(uint256) {
    return _nextImplementationTimestamp();
  }

  function nextImplementationDelay() public view returns(uint256) {
    return _nextImplementationDelay();
  }

  /**
  * Chooses the best strategy and re-invests. If the strategy did not change, it just calls
  * doHardWork on the current strategy. Call this through controller to claim hard rewards.
  */
  function doHardWork() external override whenStrategyDefined onlyControllerOrGovernance {
    uint256 sharePriceBeforeHardWork = getPricePerFullShare();
    if (_withdrawBeforeReinvesting()) {
      IStrategy(strategy()).withdrawAllToVault();
    }

    // ensure that new funds are invested too
    invest();
    IStrategy(strategy()).doHardWork();
    uint256 sharePriceAfterHardWork = getPricePerFullShare();

    if (!allowSharePriceDecrease()) {
      require(sharePriceBeforeHardWork <= sharePriceAfterHardWork, "Share price should not decrease");
    }
  }

  /*
  * Returns the cash balance across all users in this contract.
  */
  function underlyingBalanceInVault() public view override returns (uint256) {
    return IERC20Upgradeable(underlying()).balanceOf(address(this));
  }

  /* Returns the current underlying (e.g., DAI's) balance together with
   * the invested amount (if DAI is invested elsewhere by the strategy).
  */
  function underlyingBalanceWithInvestment() public view override returns (uint256) {
    if (address(strategy()) == address(0)) {
      // initial state, when not set
      return underlyingBalanceInVault();
    }
    return underlyingBalanceInVault().add(IStrategy(strategy()).investedUnderlyingBalance());
  }

  function getPricePerFullShare() public view override returns (uint256) {
    return totalSupply() == 0
        ? underlyingUnit()
        : underlyingUnit().mul(underlyingBalanceWithInvestment()).div(totalSupply());
  }

  function getEstimatedWithdrawalAmount(uint256 numberOfShares) public view returns (uint256 realTimeCalculatedValue) {
    return numberOfShares.mul(getPricePerFullShare()).div(underlyingUnit());
  }

  function underlyingBalanceWithInvestmentForHolder(address holder) external view override returns (uint256) {
    // for compatibility
    uint256 estimatedWithdrawal = getEstimatedWithdrawalAmount(balanceOf(holder));
    return estimatedWithdrawal;
  }

  function futureStrategy() public view returns (address) {
    return _futureStrategy();
  }

  function strategyUpdateTime() public view returns (uint256) {
    return _strategyUpdateTime();
  }

  function strategyTimeLock() public view returns (uint256) {
    return _strategyTimeLock();
  }

  function canUpdateStrategy(address _strategy) public view returns(bool) {
    return strategy() == address(0) // no strategy was set yet
      || (_strategy == futureStrategy()
          && block.timestamp > strategyUpdateTime()
          && strategyUpdateTime() > 0); // or the timelock has passed
  }
  
  /**
  * Indicates that the strategy update will happen in the future
  */
  function announceStrategyUpdate(address _strategy) public onlyControllerOrGovernance {
    // records a new timestamp
    uint256 when = block.timestamp.add(strategyTimeLock());
    _setStrategyUpdateTime(when);
    _setFutureStrategy(_strategy);
    emit StrategyAnnounced(_strategy, when);
  }

  /**
  * Finalizes (or cancels) the strategy update by resetting the data
  */
  function finalizeStrategyUpdate() public onlyControllerOrGovernance {
    _setStrategyUpdateTime(0);
    _setFutureStrategy(address(0));
  }

  function setStrategy(address _strategy) public override onlyControllerOrGovernance {
    require(canUpdateStrategy(_strategy),
      "The strategy exists and switch timelock did not elapse yet");
    require(_strategy != address(0), "new _strategy cannot be empty");
    require(IStrategy(_strategy).getUnderlying() == address(underlying()), "Vault underlying must match Strategy underlying");
    require(IStrategy(_strategy).getVault() == address(this), "the strategy does not belong to this vault");

    emit StrategyChanged(_strategy, strategy());
    if (address(_strategy) != address(strategy())) {
      if (address(strategy()) != address(0)) { // if the original strategy (no underscore) is defined
        IERC20Upgradeable(underlying()).safeApprove(address(strategy()), 0);
        IStrategy(strategy()).withdrawAllToVault();
      }
      _setStrategy(_strategy);
      IERC20Upgradeable(underlying()).safeApprove(address(strategy()), 0);
      IERC20Upgradeable(underlying()).safeApprove(address(strategy()), type(uint256).max);//uint256(~0)
    }
    finalizeStrategyUpdate();
  }

  function setTotalSupplyCap(uint256 value) external onlyGovernance {
    return _setTotalSupplyCap(value);
  }

  function setWithdrawFee(uint256 numerator) external onlyGovernance {
    require(numerator <= 20, "setWithdrawFee: fee too high");
    return _setWithdrawFee(((10 ** decimals()) * numerator) / 100);
  }

  function setVaultFractionToInvest(uint256 numerator, uint256 denominator) external override onlyGovernance {
    require(denominator > 0, "denominator must be greater than 0");
    require(numerator <= denominator, "denominator must be greater than or equal to the numerator");
    _setVaultFractionToInvestNumerator(numerator);
    _setVaultFractionToInvestDenominator(denominator);
  }

  function setWithdrawBeforeReinvesting(bool value) external onlyGovernance {
    _setWithdrawBeforeReinvesting(value);
  }

  function withdrawBeforeReinvesting() public view returns (bool) {
    return _withdrawBeforeReinvesting();
  }

  function setAllowSharePriceDecrease(bool value) external onlyGovernance {
    _setAllowSharePriceDecrease(value);
  }

  function allowSharePriceDecrease() public view returns (bool) {
    return _allowSharePriceDecrease();
  }

  function availableToInvestOut() public view returns (uint256) {
    uint256 wantInvestInTotal = underlyingBalanceWithInvestment()
        .mul(vaultFractionToInvestNumerator())
        .div(vaultFractionToInvestDenominator());
    uint256 alreadyInvested = IStrategy(strategy()).investedUnderlyingBalance();
    if (alreadyInvested >= wantInvestInTotal) {
      return 0;
    } else {
      uint256 remainingToInvest = wantInvestInTotal.sub(alreadyInvested);
      return remainingToInvest <= underlyingBalanceInVault()
        // TODO: we think that the "else" branch of the ternary operation is not
        // going to get hit
        ? remainingToInvest : underlyingBalanceInVault();
    }
  }

  function invest() internal whenStrategyDefined {
    uint256 availableAmount = availableToInvestOut();
    if (availableAmount > 0) {
      IERC20Upgradeable(underlying()).safeTransfer(address(strategy()), availableAmount);
      emit Invest(availableAmount);
    }
  }

  /*
  * Allows for depositing the underlying asset in exchange for shares.
  * Approval is assumed.
  */
  function deposit(uint256 amount) external override defense nonReentrant {
    _deposit(amount, msg.sender, msg.sender);
  }

  /*
  * Allows for depositing the underlying asset in exchange for shares
  * assigned to the holder.
  * This facilitates depositing for someone else (using DepositHelper)
  */
  function depositFor(uint256 amount, address holder) public override defense nonReentrant {
    _deposit(amount, msg.sender, holder);
  }

  function withdrawAll() public override onlyControllerOrGovernance whenStrategyDefined {
    IStrategy(strategy()).withdrawAllToVault();
  }

  function withdraw(uint256 numberOfShares) external override defense nonReentrant {
    require(totalSupply() > 0, "Vault has no shares");
    require(numberOfShares > 0, "numberOfShares must be greater than 0");
    
    require(_getDepositBlock(msg.sender) != block.number, "withdraw: withdraw in same block not permitted");
    
    uint256 totalShareSupply = totalSupply();

    uint256 withdrawFeeShares = numberOfShares
      .mul(withdrawFee())
      .div(underlyingUnit());

    uint256 numberOfSharesPostFee = numberOfShares.sub(withdrawFeeShares);
    uint256 underlyingAmountToWithdraw = getEstimatedWithdrawalAmount(numberOfSharesPostFee);

    _burn(msg.sender, numberOfShares);
    // Hand fees to controller.
    _mint(controller(), withdrawFeeShares);


    if (underlyingAmountToWithdraw > underlyingBalanceInVault()) {
      // withdraw everything from the strategy to accurately check the share value
      if (numberOfSharesPostFee == totalShareSupply) {
        IStrategy(strategy()).withdrawAllToVault();
        underlyingAmountToWithdraw = underlyingBalanceInVault();
      } else {
        uint256 missingUnderlying = underlyingAmountToWithdraw.sub(underlyingBalanceInVault());

        IStrategy(strategy()).withdrawToVault(missingUnderlying);

        uint256 updatedUnderlyingAmountToWithdraw = underlyingBalanceWithInvestment()
          .mul(numberOfSharesPostFee)
          .div(totalShareSupply);

        underlyingAmountToWithdraw = MathUpgradeable.min(
          updatedUnderlyingAmountToWithdraw,
          underlyingBalanceInVault()
        );
      }
    }

    IERC20Upgradeable(underlying()).safeTransfer(msg.sender, underlyingAmountToWithdraw);

    // update the withdrawal amount for the holder
    emit Withdraw(msg.sender, underlyingAmountToWithdraw);
  }

  function _deposit(uint256 amount, address sender, address beneficiary) internal {
    require(amount > 0, "Cannot deposit 0");
    require(beneficiary != address(0), "holder must be defined");

    if (address(strategy()) != address(0)) {
      require(IStrategy(strategy()).depositArbCheck(), "Too much arb");
    }

    uint256 toMint = amount.mul(underlyingUnit()).div(getPricePerFullShare());

    require(
      totalSupplyCap() == 0 || totalSupply().add(toMint) <= totalSupplyCap(),
      "Cannot mint more than cap"
    );

    // Prevent deposit and withdraw in same block.
    _setDepositBlock(beneficiary);
    if (sender != beneficiary) {
      _setDepositBlock(sender);
    }

    _mint(beneficiary, toMint);

    IERC20Upgradeable(underlying()).safeTransferFrom(sender, address(this), amount);

    // update the contribution amount for the beneficiary
    emit Deposit(beneficiary, amount);
  }

  /**
  * Schedules an upgrade for this vault's proxy.
  */
  function scheduleUpgrade(address impl) public onlyGovernance {
    _setNextImplementation(impl);
    _setNextImplementationTimestamp(block.timestamp.add(nextImplementationDelay()));
  }

  function shouldUpgrade() external view override returns (bool, address) {
    return (
      nextImplementationTimestamp() != 0
        && block.timestamp > nextImplementationTimestamp()
        && nextImplementation() != address(0),
      nextImplementation()
    );
  }

  function finalizeUpgrade() external override onlyGovernance {
    _setNextImplementation(address(0));
    _setNextImplementationTimestamp(0);
    // for vaults V3
    _setAllowSharePriceDecrease(false);
    _setWithdrawBeforeReinvesting(false);
    require(!withdrawBeforeReinvesting(), "withdrawBeforeReinvesting is incorrect");
    require(!allowSharePriceDecrease(), "allowSharePriceDecrease is incorrect");
  }
}
