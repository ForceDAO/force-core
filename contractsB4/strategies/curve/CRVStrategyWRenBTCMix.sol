pragma solidity 0.5.16;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/Gauge.sol";
import "./interfaces/ICurveFiWbtc.sol";
import "../ProfitNotifier.sol";
import "../../hardworkInterface/IStrategy.sol";
import "../../uniswap/interfaces/IUniswapV2Router02.sol";


contract CRVStrategyWRenBTCMix is IStrategy, ProfitNotifier {

  enum TokenIndex {REN_BTC, WBTC}

  using SafeERC20 for IERC20;
  using Address for address;
  using SafeMath for uint256;

  // wbtc token address (or ren if we want both)
  address public wbtc;

  // the matching enum record used to determine the index
  TokenIndex tokenIndex;

  // our vault holding the wbtc asset
  address public vault;

  // the address of mixToken token
  address public mixToken;

  // the address of underlying token
  address public underlying;

  // the address of the Curve protocol's pool for REN + WBTC
  address public curve;

  // these tokens cannot be claimed by the governance
  mapping(address => bool) public unsalvagableTokens;

  // the wbtc gauge in Curve
  address public gauge;

  // the reward minter
  address public mintr;

  // the address for the CRV token
  address public crv;

  // uniswap router address
  address public uni;

  // liquidation path to be used
  address[] public uniswap_CRV2WBTC;

  // a flag for disabling selling for simplified emergency exit
  bool public sell = true;

  // minimum CRV amount to be liquidation
  uint256 public sellFloor = 12e18;

  event Liquidating(uint256 amount);
  event NotLiquidating(uint256 amount);
  event ProfitsNotCollected();


  modifier restricted() {
    require(msg.sender == vault || msg.sender == controller()
      || msg.sender == governance(),
      "The sender has to be the controller, governance, or vault");
    _;
  }

  constructor(
    address _storage,
    address _wbtc,
    address _vault,
    uint256 _tokenIndex,
    address _mixToken,
    address _curvePool,
    address _crv,
    address _weth,
    address _gauge,
    address _mintr,
    address _uniswap
  )
  ProfitNotifier(_storage, _wbtc) public {
    vault = _vault;
    underlying = _mixToken;
    wbtc = _wbtc; 
    tokenIndex = TokenIndex(_tokenIndex);
    mixToken = _mixToken;
    curve = _curvePool;
    gauge = _gauge;
    crv = _crv;
    uni = _uniswap;
    mintr = _mintr;

    uniswap_CRV2WBTC = [_crv, _weth, _wbtc]; 

    // set these tokens to be not salvageable
    unsalvagableTokens[wbtc] = true;
    unsalvagableTokens[mixToken] = true;
    unsalvagableTokens[crv] = true;
  }

  function depositArbCheck() public view returns(bool) {
    return true;
  }

  /**
  * Uses the Curve protocol to convert the wbtc asset into to mixed renwbtc token.
  */
  function mixFromWBTC() internal {
    uint256 wbtcBalance = IERC20(wbtc).balanceOf(address(this));
    if (wbtcBalance > 0) {
      IERC20(wbtc).safeApprove(curve, 0);
      IERC20(wbtc).safeApprove(curve, wbtcBalance);
      // we can accept 0 as minimum because this is called only by a trusted role
      uint256 minimum = 0;
      uint256[2] memory coinAmounts = wrapCoinAmount(wbtcBalance);
      ICurveFiWbtc(curve).add_liquidity(
        coinAmounts, minimum
      );
    }
    // now we have the mixed token
  }

  /**
  * Withdraws an wbtc asset from the strategy to the vault in the specified amount by asking
  * by removing imbalanced liquidity from the Curve protocol. The rest is deposited back to the
  * Curve protocol pool. If the amount requested cannot be obtained, the method will get as much
  * as we have.
  */
  function withdrawToVault(uint256 amountUnderlying) external restricted {
    // withdraw all from gauge
    Gauge(gauge).withdraw(Gauge(gauge).balanceOf(address(this)));
    // we can transfer the asset to the vault
    uint256 actualBalance = IERC20(underlying).balanceOf(address(this));
    if (actualBalance > 0) {
      IERC20(underlying).safeTransfer(vault, Math.min(amountUnderlying, actualBalance));
    }

    // invest back the rest
    investAllUnderlying();
  }

  /**
  * Withdraws all assets from the vault.
  */
  function withdrawAllToVault() external restricted {
    // withdraw all from gauge
    Gauge(gauge).withdraw(Gauge(gauge).balanceOf(address(this)));

    // we can transfer the asset to the vault
    uint256 actualBalance = IERC20(underlying).balanceOf(address(this));
    if (actualBalance > 0) {
      IERC20(underlying).safeTransfer(vault, actualBalance);
    }
  }

  /**
  * Invests all wbtc assets into our mixToken vault.
  */
  function investAllUnderlying() internal {
    // then deposit into the mixToken vault
    uint256 mixTokenBalance = IERC20(underlying).balanceOf(address(this));
    if (mixTokenBalance > 0) {
      IERC20(underlying).safeApprove(gauge, 0);
      IERC20(underlying).safeApprove(gauge, mixTokenBalance);
      Gauge(gauge).deposit(mixTokenBalance);
    }
  }

  /**
  * The hard work only invests all wbtc assets, and then tells the controller to call hard
  * work on the mixToken vault.
  */
  function doHardWork() public restricted {
    claimAndLiquidateCrv();
    investAllUnderlying();
  }

  /**
  * Salvages a token. We cannot salvage mixToken tokens, CRV, or wbtc assets.
  */
  function salvage(address recipient, address token, uint256 amount) public onlyGovernance {
    // To make sure that governance cannot come in and take away the coins
    require(!unsalvagableTokens[token], "token is defined as not salvageable");
    IERC20(token).safeTransfer(recipient, amount);
  }

  /**
  * Returns the wbtc invested balance. The is the wbtc amount in this stragey, plus the gauge
  * amount of the mixed token converted back to wbtc.
  */
  function investedUnderlyingBalance() public view returns (uint256) {
    uint256 gaugeBalance = Gauge(gauge).balanceOf(address(this));
    uint256 underlyingBalance = IERC20(underlying).balanceOf(address(this));
    if (gaugeBalance == 0) {
      // !!! if we have 0 balance in gauge, the conversion to wbtc reverts in Curve
      // !!! this if-statement is necessary to avoid transaction reverts
      return underlyingBalance;
    }
    return gaugeBalance.add(underlyingBalance);
  }

  /**
  * Wraps the coin amount in the array for interacting with the Curve protocol
  */
  function wrapCoinAmount(uint256 amount) internal view returns (uint256[2] memory) {
    uint256[2] memory amounts = [uint256(0), uint256(0)];
    amounts[uint56(tokenIndex)] = amount;
    return amounts;
  }

  /**
  * Claims the CRV crop, converts it to WBTC/renWBTC on Uniswap
  */
  function claimAndLiquidateCrv() internal {
    if (!sell) {
      // Profits can be disabled for possible simplified and rapid exit
      emit ProfitsNotCollected();
      return;
    }
    Mintr(mintr).mint(gauge);
    // claiming rewards and liquidating them
    uint256 crvBalance = IERC20(crv).balanceOf(address(this));
    if (crvBalance > sellFloor) {
      emit Liquidating(crvBalance);
      uint256 wbtcBalanceBefore = IERC20(wbtc).balanceOf(address(this));
      IERC20(crv).safeApprove(uni, 0);
      IERC20(crv).safeApprove(uni, crvBalance);
      // we can accept 1 as the minimum because this will be called only by a trusted worker
      IUniswapV2Router02(uni).swapExactTokensForTokens(
        crvBalance, 1, uniswap_CRV2WBTC, address(this), block.timestamp
      );

      // now we have WBTC
      notifyProfit(wbtcBalanceBefore, IERC20(wbtc).balanceOf(address(this)));

      // Convert WBTC into mixBTC
      mixFromWBTC();
    } else {
      emit NotLiquidating(crvBalance);
    }
  }

  /**
  * Can completely disable claiming CRV rewards and selling. Good for emergency withdraw in the
  * simplest possible way.
  */
  function setSell(bool s) public onlyGovernance {
    sell = s;
  }

  /**
  * Sets the minimum amount of CRV needed to trigger a sale.
  */
  function setSellFloor(uint256 floor) public onlyGovernance {
    sellFloor = floor;
  }
}