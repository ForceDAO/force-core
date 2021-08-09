//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "../../uniswap/interfaces/IUniswapV2Router02.sol";
import "../../uniswap/interfaces/IUniswapV2Pair.sol";
import "../../hardworkInterface/IStrategy.sol";
import "../../hardworkInterface/IVault.sol";
import "./BaseUpgradeableStrategy.sol";
import "./IMiniChefV2.sol";


contract MasterChefHodlStrategy is IStrategy, BaseUpgradeableStrategy {

  using SafeMathUpgradeable for uint256;
  using SafeERC20Upgradeable for IERC20Upgradeable;

  // additional storage slots (on top of BaseUpgradeableStrategy ones) are defined here
  bytes32 internal constant _POOLID_SLOT = 0x3fd729bfa2e28b7806b03a6e014729f59477b530f995be4d51defc9dad94810b;
  bytes32 internal constant _FEERATIO_SLOT = 0xdd068d8a32502e81a10cdf5394059be07ccd47fe6df7741b57a2f9937efedeaf;
  bytes32 internal constant _FEEHOLDER_SLOT = 0x00679b6f1cace16785324a171df0e550ee9f20b64671a53b5c491a3065b30f2b;
  bytes32 internal constant _ROUTER_ADDRESS_V2_SLOT = 0x92199eab42483f175b95375c69585e82b184587d7846fbeb28030f68fbdf2feb;
  bytes32 internal constant _SUSHI_TOKEN_ADDRESS_SLOT = 0xcf3b156443750e93863e4613b74db96a0f6b1a281dd67c87ff4afda1c52d545a;
  bytes32 internal constant _WMATIC_TOKEN_ADDRESS_SLOT = 0x9b943037a3ba4823127740ffb7abf7566d132d3c50fe28fa8fd45de2c2a6f834;
  bytes32 internal constant _SELL_SUSHI_BOOL_SLOT = 0xb404b34be2ff9c417c92ed70e602d3743dc67c81ec3e52a56e152248436e66f2;
  bytes32 internal constant _SELL_WMATIC_BOOL_SLOT = 0x73f61035ecc9fe9b9df7f01bc4f1011784dd694ac3cac759bcd208fbf3da6e4a;
  bytes32 internal constant _CLAIM_ALLOWED_BOOL_SLOT = 0x643da254e9d7470053896c065c0a957d88a3eb48e03c87bfdfe16b3b5282046a;
  bytes32 internal constant _FEE_BASE_UNIT256_SLOT = 0xb03ba70f2714416bbb89d5653110256725bbfd3c1a0a6334c283e953a6ea7993;
  bytes32 internal constant _MIN_LIQUIDATE_TOKENS_SLOT = 0x9a17f7f8724c1a2f0558868646dcdc38b7bebed9cec1eb59d4529eaa55f4cfad;
 
  //Wmatic -> WETH paths[0]
  bytes32 internal constant _ROUTE_WMATIC_TOKEN0_LHS = 0x6565901a24447709405ab3697f2ea640ce7791edb0ea046095d626972d683601;
  
  //Wmatic -> WETH paths[1]
  bytes32 internal constant _ROUTE_WMATIC_TOKEN0_RHS = 0x900fb2a9fa2b2b2820f295064f6e6adbf7ddab98fcd6d808328c83637697bcab;

  //Wmatic -> underlying paths[0]
  bytes32 internal constant _ROUTE_WMATIC_TOKEN1_LHS = 0x8faa525983a40d73a9645634c5c07faf273c288aac622ba3f4b00dc2bdcc70ed;

  //Wmatic -> underlying paths[1]
  bytes32 internal constant _ROUTE_WMATIC_TOKEN1_RHS = 0x11715c74c260a518c242046509eb0522741596bbc940b2effdc1424b13e585fd;

  //SUSHI -> WETH paths[0]
  bytes32 internal constant _ROUTE_SUSHI_TOKEN0_LHS = 0x525d87f3a88df1e5365945ad2b18acddb07378fd70f898bf731c21f78fe2f23b;

  //SUSHI -> WETH paths[1]
  bytes32 internal constant _ROUTE_SUSHI_TOKEN0_RHS = 0x158eb59ee802a12ccb51e0e690e309c49ee37438bb1ded3c31f09ac4348b2923;

  //SUSHI -> underlying paths[0]
  bytes32 internal constant _ROUTE_SUSHI_TOKEN1_LHS = 0x05bbcb07ee015ebbef26793b36c0acd7e35b0da4e41c9be77244c04eb97ad92a;

  //SUSHI -> underlying paths[1]
  bytes32 internal constant _ROUTE_SUSHI_TOKEN1_RHS = 0xab89abbedde2addb80dde4b5025427e94813c85004af27ed6a3d14614e675d5a;

  event LogLiquidateRewardToken(address indexed rewardTokenAddress, address indexed token0Address, address indexed token1Address, uint256 rewardTokenBalance, uint256 token0Amount, uint256 token1Amount);
  event LogLiquidityAdded(address indexed token0Address, address indexed token1Address, uint256 amountA, uint256 amountB, uint256 liquidity);


  constructor() BaseUpgradeableStrategy() {
    assert(_POOLID_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.poolId")) - 1));
    assert(_FEERATIO_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeRatio")) - 1));
    assert(_FEEHOLDER_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeHolder")) - 1));
    assert(_ROUTER_ADDRESS_V2_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.routerAddressV2")) - 1));
    assert(_SUSHI_TOKEN_ADDRESS_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sushiTokenAddress")) - 1));
    assert(_WMATIC_TOKEN_ADDRESS_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.wmaticTokenAddress")) - 1));
    assert(_SELL_SUSHI_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sellSushi")) - 1));
    assert(_SELL_WMATIC_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sellMatic")) - 1));
    assert(_CLAIM_ALLOWED_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.claimAllowed")) - 1));
    assert(_FEE_BASE_UNIT256_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeBase")) - 1));
    assert(_MIN_LIQUIDATE_TOKENS_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.minLiquidateTokens")) - 1));

    assert(_ROUTE_WMATIC_TOKEN0_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token0.lhs")) - 1));
    assert(_ROUTE_WMATIC_TOKEN0_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token0.rhs")) - 1));

    assert(_ROUTE_WMATIC_TOKEN1_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token1.lhs")) - 1));
    assert(_ROUTE_WMATIC_TOKEN1_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token1.rhs")) - 1));

    assert(_ROUTE_SUSHI_TOKEN0_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token0.lhs")) - 1));
    assert(_ROUTE_SUSHI_TOKEN0_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token0.rhs")) - 1));
    
    assert(_ROUTE_SUSHI_TOKEN1_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token1.lhs")) - 1));
    assert(_ROUTE_SUSHI_TOKEN1_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token1.rhs")) - 1));
  }

  /// @param _storage Root Storage Contract Address (Storage.sol)
  /// @param _underlying Underlying token deposit through vault
  /// @param _vault Vault Contract Address
  /// @param _miniChefV2 MiniChefV2 Contract Address
  /// @param _poolId MiniChefV2 PoolId for the underlying
  /// @param _routerAddressV2 UniswapRouterV2 Address
  /// @param _sushiTokenAddress Sushi Reward-Token Address (Incoming Yield paid in Sushi)
  /// @param _wmaticTokenAddress WMatic Reward-Token Address (Incoming Yield paid in Matic)
  /// @param _routeSushiToken0 Uniswap-Route for Sushi to Token0 of Pool
  /// @param _routeSushiToken1 Uniswap-Route for Sushi to Token1 of Pool
  /// @param _routeWmaticToken0 Uniswap-Route for WMatic to Token0 of Pool
  /// @param _routeWmaticToken1 Uniswap-Route for WMatic to Token1 of Pool
  function initializeMasterChefHodlStrategy(
    address _storage,
    address _underlying,
    address _vault,
    address _miniChefV2,
    uint256 _poolId,
    address _routerAddressV2,
    address _sushiTokenAddress,
    address _wmaticTokenAddress,
    address[] memory _routeSushiToken0,
    address[] memory _routeSushiToken1,
    address[] memory _routeWmaticToken0,
    address[] memory _routeWmaticToken1
  ) public initializer {
    require(_storage != address(0), "storage is empty");
    require(_underlying != address(0), "underlying is empty");
    require(_vault != address(0), "vault is empty");
    require(_miniChefV2 != address(0), "reward pool is empty");
    require(_routerAddressV2 != address(0), "routerAddressV2 is empty");
    require(_routeSushiToken0.length == 2, "routeSushi-Token0 is invalid");
    require(_routeSushiToken1.length == 2, "routeSushi-Token1 is invalid");
    require(_routeWmaticToken0.length == 2, "routeWmatic-Token0 is invalid");
    require(_routeWmaticToken1.length == 2, "routeWmatic-Token1 is invalid");
    require(_routeSushiToken0[0] != address(0) || _routeSushiToken0[1] != address(0), "Zero-Address is invalid");
    require(_routeSushiToken1[0] != address(0) || _routeSushiToken1[1] != address(0), "Zero-Address is invalid");
    require(_routeWmaticToken0[0] != address(0) || _routeWmaticToken0[1] != address(0), "Zero-Address is invalid");
    require(_routeWmaticToken1[0] != address(0) || _routeWmaticToken1[1] != address(0), "Zero-Address is invalid");

    BaseUpgradeableStrategy.initialize(
      _storage,
      _underlying,
      _vault,
      _miniChefV2,
      300, // profit sharing numerator
      1000, // profit sharing denominator
      true, // sell
      1e18, // sell floor
      12 hours // implementation change delay
    );
    
    address _lpt = IMiniChefV2(rewardPool()).lpToken(_poolId);
    require(_lpt == underlying(), "Pool Info does not match underlying");

    setUint256(_MIN_LIQUIDATE_TOKENS_SLOT, 10 ether);
    setUint256(_POOLID_SLOT, _poolId);
    setAddress(_ROUTER_ADDRESS_V2_SLOT, _routerAddressV2);
    setAddress(_SUSHI_TOKEN_ADDRESS_SLOT, _sushiTokenAddress);
    setAddress(_WMATIC_TOKEN_ADDRESS_SLOT, _wmaticTokenAddress);

    setAddress(_ROUTE_SUSHI_TOKEN0_LHS, _routeSushiToken0[0]);
    setAddress(_ROUTE_SUSHI_TOKEN0_RHS, _routeSushiToken0[1]);
    setAddress(_ROUTE_SUSHI_TOKEN1_LHS, _routeSushiToken1[0]);
    setAddress(_ROUTE_SUSHI_TOKEN1_RHS, _routeSushiToken1[1]);

    setAddress(_ROUTE_WMATIC_TOKEN0_LHS, _routeWmaticToken0[0]);
    setAddress(_ROUTE_WMATIC_TOKEN0_RHS, _routeWmaticToken0[1]);
    setAddress(_ROUTE_WMATIC_TOKEN1_LHS, _routeWmaticToken1[0]);
    setAddress(_ROUTE_WMATIC_TOKEN1_RHS, _routeWmaticToken1[1]);
    
    setUint256(_FEE_BASE_UNIT256_SLOT, 1000);
  }

  function getWmaticRoutes() public view returns (address[] memory, address[] memory){

    address[] memory wmaticToken0Route = new address[](2);
    address wmaticToken0Lhs = getAddress(_ROUTE_WMATIC_TOKEN0_LHS);
    wmaticToken0Route[0] = wmaticToken0Lhs;
    address wmaticToken0Rhs = getAddress(_ROUTE_WMATIC_TOKEN0_RHS);
    wmaticToken0Route[1] = wmaticToken0Rhs;

    address[] memory wmaticToken1Route = new address[](2);
    address wmaticToken1Lhs = getAddress(_ROUTE_WMATIC_TOKEN1_LHS);
    wmaticToken1Route[0] = wmaticToken1Lhs;
    address wmaticToken1Rhs = getAddress(_ROUTE_WMATIC_TOKEN1_RHS);
    wmaticToken1Route[1] = wmaticToken1Rhs;

    return (wmaticToken0Route, wmaticToken1Route);
  }


  function getSushiRoutes() public view returns (address[] memory, address[] memory){

    address[] memory sushiToken0Route = new address[](2);
    address sushiToken0Lhs = getAddress(_ROUTE_SUSHI_TOKEN0_LHS);
    sushiToken0Route[0] = sushiToken0Lhs;
    address sushiToken0Rhs = getAddress(_ROUTE_SUSHI_TOKEN0_RHS);
    sushiToken0Route[1] = sushiToken0Rhs;

    address[] memory sushiToken1Route = new address[](2);
    address sushiToken1Lhs = getAddress(_ROUTE_SUSHI_TOKEN1_LHS);
    sushiToken1Route[0] = sushiToken1Lhs;
    address sushiToken1Rhs = getAddress(_ROUTE_SUSHI_TOKEN1_RHS);
    sushiToken1Route[1] = sushiToken1Rhs;
    
    return (sushiToken0Route, sushiToken1Route);
  }

  function depositArbCheck() public pure override returns(bool) {
    return true;
  }

  function rewardPoolBalance() internal view returns (uint256 bal) {
      IMiniChefV2.UserInfo memory userInfo = IMiniChefV2(rewardPool()).userInfo(poolId(), address(this));
      bal = userInfo.amount;
  }

  function exitRewardPool() internal {
      uint256 bal = rewardPoolBalance();
      if (bal != 0) {
          if (claimAllowed()) {
            IMiniChefV2(rewardPool()).withdrawAndHarvest(poolId(), bal, address(this));
          } else {
            IMiniChefV2(rewardPool()).withdraw(poolId(), bal, address(this));
          }
      }
  }

  function emergencyExitRewardPool() internal {
      uint256 bal = rewardPoolBalance();
      if (bal != 0) {
          IMiniChefV2(rewardPool()).emergencyWithdraw(poolId(), address(this));
      }
  }

  function unsalvagableTokens(address token) public view override returns (bool) {
    return (token == sushiTokenAddress() || token == wmaticTokenAddress() || token == underlying());
  }

  function enterRewardPool() internal {
    uint256 entireBalance = IERC20Upgradeable(underlying()).balanceOf(address(this));
    IERC20Upgradeable(underlying()).safeApprove(rewardPool(), 0);
    IERC20Upgradeable(underlying()).safeApprove(rewardPool(), entireBalance);
    IMiniChefV2(rewardPool()).deposit(poolId(), entireBalance, address(this));
  }

  /*
  *   In case there are some issues discovered about the pool or underlying asset
  *   Governance can exit the pool properly
  *   The function is only used for emergency to exit the pool
  */
  function emergencyExit() public onlyGovernance {
    emergencyExitRewardPool();
    _setPausedInvesting(true);
  }

  /*
  *   Resumes the ability to invest into the underlying reward pools
  */

  function continueInvesting() public onlyGovernance {
    _setPausedInvesting(false);
  }

  // We Hodl all the rewards
  function _hodlAndNotify() internal {

    uint256 liquidityAdded;

    //liquidate the Sushi Rewards
    if (sellSushi()) {
      (address[] memory sushiPath0, address[] memory sushiPath1) = getSushiRoutes();
      liquidityAdded = liquidityAdded.add(liquidateRewardToken(sushiTokenAddress(), sushiPath0, sushiPath1));
    }

    //liquidate the WMatic Rewards
    if (sellWMatic()) {
      (address[] memory maticPath0, address[] memory maticPath1) = getWmaticRoutes();
      liquidityAdded = liquidityAdded.add(liquidateRewardToken(wmaticTokenAddress(), maticPath0, maticPath1));
    }

    //compute Fee and transfer Fee to controller
    if(controller() != address(0)){
      uint256 fee = liquidityAdded.mul(feeRatio()).div(feeBase());
      if(fee > 0){
        IERC20Upgradeable(underlying()).safeTransfer(controller(), fee);
      }
    }
  }

  function liquidateRewardToken(address _rewardTokenAddress, address[] memory _uniswapPath0, address[] memory _uniswapPath1) internal returns (uint256) {
    uint256 rewardTokenBalance = IERC20Upgradeable(_rewardTokenAddress).balanceOf(address(this));

    if (rewardTokenBalance > minLiquidateTokens()) {
      //halve the tokenBalance
      //first half of tokenBalance will be used to buy token0
      //second half of tokenBalance will be used to buy token1
      uint256 half = rewardTokenBalance.div(2);
      uint256 otherHalf = rewardTokenBalance.sub(half);

      IERC20Upgradeable(_rewardTokenAddress).safeApprove(routerAddressV2(), 0);
      IERC20Upgradeable(_rewardTokenAddress).safeApprove(routerAddressV2(), rewardTokenBalance);
      
      uint256 token0Amount;

      if(_uniswapPath0[0] != _uniswapPath0[1]){
        // we can accept 1 as the minimum because this will be called only by a trusted worker
        uint256[] memory amounts0 = IUniswapV2Router02(routerAddressV2()).swapExactTokensForTokens(
          half,
          1,
          _uniswapPath0,
          address(this),
          block.timestamp
        );

        token0Amount = amounts0[amounts0.length - 1];
      } else {
        token0Amount = half;
      }

      uint256 token1Amount;

      if(_uniswapPath1[0] != _uniswapPath1[1]){

        // we can accept 1 as the minimum because this will be called only by a trusted worker
        uint256[] memory amounts1 = IUniswapV2Router02(routerAddressV2()).swapExactTokensForTokens(
          otherHalf,
          1,
          _uniswapPath1,
          address(this),
          block.timestamp
        );

        token1Amount = amounts1[amounts1.length - 1];
      } else {
        token1Amount = otherHalf;
      }

      //reset approval to 0.
      IERC20Upgradeable(_rewardTokenAddress).safeApprove(routerAddressV2(), 0);

      address token0Address = _uniswapPath0[1];
      address token1Address = _uniswapPath1[1];

      emit LogLiquidateRewardToken(_rewardTokenAddress, token0Address, token1Address, rewardTokenBalance, token0Amount, token1Amount);
      return addLiquidity(token0Address, token0Amount, token1Address, token1Amount);
    } else {
      return 0;
    }
  }

  function addLiquidity(address token0Address, uint256 token0Amount, address token1Address, uint256 token1Amount) private returns (uint256) {
    // approve token transfer
    IERC20Upgradeable(token0Address).safeApprove(routerAddressV2(), 0);
    IERC20Upgradeable(token0Address).safeApprove(routerAddressV2(), token0Amount);
    IERC20Upgradeable(token1Address).safeApprove(routerAddressV2(), 0);
    IERC20Upgradeable(token1Address).safeApprove(routerAddressV2(), token1Amount);

    // add the liquidity
    (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(routerAddressV2()).addLiquidity(
      token0Address,
      token1Address,
      token0Amount,
      token1Amount,
      1,  // min
      1,  // min
      address(this),
      block.timestamp
    );

    emit LogLiquidityAdded(token0Address, token1Address, amountA, amountB, liquidity);
    return liquidity;
  }

  /*
  *   Stakes everything the strategy holds into the reward pool
  */
  function investAllUnderlying() internal onlyNotPausedInvesting {
    // this check is needed, because most of the SNX reward pools will revert if
    // you try to stake(0).
    if(IERC20Upgradeable(underlying()).balanceOf(address(this)) > 0) {
      enterRewardPool();
    }
  }

  /*
  *   Withdraws all the asset to the vault
  */
  function withdrawAllToVault() public override restricted {
    exitRewardPool();
    _hodlAndNotify();
    IERC20Upgradeable(underlying()).safeTransfer(vault(), IERC20Upgradeable(underlying()).balanceOf(address(this)));
  }

  /*
  *   Withdraws all the asset to the vault
  */
  function withdrawToVault(uint256 amount) public override restricted {
    // Typically there wouldn't be any amount here
    // however, it is possible because of the emergencyExit
    uint256 entireBalance = IERC20Upgradeable(underlying()).balanceOf(address(this));

    if(amount > entireBalance){
      // While we have the check above, we still using SafeMath below
      // for the peace of mind (in case something gets changed in between)
      uint256 needToWithdraw = amount.sub(entireBalance);
      uint256 toWithdraw = MathUpgradeable.min(rewardPoolBalance(), needToWithdraw);
      IMiniChefV2(rewardPool()).withdraw(poolId(), toWithdraw, address(this));
    }

    IERC20Upgradeable(underlying()).safeTransfer(vault(), amount);
  }

  /*
  *   Note that we currently do not have a mechanism here to include the
  *   amount of reward that is accrued.
  */
  function investedUnderlyingBalance() external view override returns (uint256) {
    if (rewardPool() == address(0)) {
      return IERC20Upgradeable(underlying()).balanceOf(address(this));
    }
    // Adding the amount locked in the reward pool and the amount that is somehow in this contract
    // both are in the units of "underlying"
    // The second part is needed because there is the emergency exit mechanism
    // which would break the assumption that all the funds are always inside of the reward pool
    return rewardPoolBalance().add(IERC20Upgradeable(underlying()).balanceOf(address(this)));
  }

  /*
  *   Governance or Controller can claim coins that are somehow transferred into the contract
  *   Note that they cannot come in take away coins that are used and defined in the strategy itself
  */
  function salvage(address recipient, address token, uint256 amount) external override onlyControllerOrGovernance {
     // To make sure that governance cannot come in and take away the coins
    require(!unsalvagableTokens(token), "token is defined as not salvagable");
    IERC20Upgradeable(token).safeTransfer(recipient, amount);
  }

  /*
  *   Get the reward, sell it in exchange for underlying, invest what you got.
  *   It's not much, but it's honest work.
  *
  *   Note that although `onlyNotPausedInvesting` is not added here,
  *   calling `investAllUnderlying()` affectively blocks the usage of `doHardWork`
  *   when the investing is being paused by governance.
  */
  function doHardWork() external override onlyNotPausedInvesting restricted {
    exitRewardPool();
    _hodlAndNotify();
    investAllUnderlying();
  }

  function setFeeRatio(uint256 _value) public onlyGovernance {
    require(_value <= feeBase().mul(3).div(10), "Cannot be more then 30%");
    setUint256(_FEERATIO_SLOT, _value);
  }

  function setFeeHolder(address _value) public onlyGovernance {
    setAddress(_FEEHOLDER_SLOT, _value);
  }

  function feeRatio() public view returns (uint256) {
    return getUint256(_FEERATIO_SLOT);
  }

  function feeHolder() public view returns (address) {
    return getAddress(_FEEHOLDER_SLOT);
  }

  function finalizeUpgrade() external onlyGovernance {
    setFeeRatio(1500);
    _finalizeUpgrade();
  }

  function poolId() public view returns (uint256) {
    return getUint256(_POOLID_SLOT);
  }

  function routerAddressV2() public view returns (address) {
    return getAddress(_ROUTER_ADDRESS_V2_SLOT);
  }

  function sushiTokenAddress() public view returns (address) {
    return getAddress(_SUSHI_TOKEN_ADDRESS_SLOT);
  }

  function wmaticTokenAddress() public view returns (address) {
    return getAddress(_WMATIC_TOKEN_ADDRESS_SLOT);
  }

  function setSellSushi(bool _sellSushi) internal {
    setBoolean(_SELL_SUSHI_BOOL_SLOT, _sellSushi);
  }

  function sellSushi() public view returns (bool) {
    return getBoolean(_SELL_SUSHI_BOOL_SLOT);
  }

  function setSellWMatic(bool _sellWMatic) internal {
    setBoolean(_SELL_WMATIC_BOOL_SLOT, _sellWMatic);
  }

  function sellWMatic() public view returns (bool) {
    return getBoolean(_SELL_WMATIC_BOOL_SLOT);
  }

  function setClaimAllowed(bool _claimAllowed) internal {
    setBoolean(_CLAIM_ALLOWED_BOOL_SLOT, _claimAllowed);
  }

  function claimAllowed() public view returns (bool) {
    return getBoolean(_CLAIM_ALLOWED_BOOL_SLOT);
  }

  function feeBase() public view returns (uint256) {
    return getUint256(_FEE_BASE_UNIT256_SLOT);
  }
  function minLiquidateTokens() public view returns (uint256) {
    return getUint256(_MIN_LIQUIDATE_TOKENS_SLOT);
  }

  function getVault() public view override returns (address) {
    return vault();
  }

  function getUnderlying() public view override returns (address) {
    return underlying();
  }

  function setLiquidation(
      bool _sellSushi,
      bool _sellWMatic,
      bool _claimAllowed
  ) public onlyGovernance {
      setSellSushi(_sellSushi);
      setSellWMatic(_sellWMatic);
      setClaimAllowed(_claimAllowed);
  }

  function setMinLiquidateTokens(uint256 minLiquidate)
    public
    onlyGovernance
  {
      setUint256(_MIN_LIQUIDATE_TOKENS_SLOT, minLiquidate);
  }
}
