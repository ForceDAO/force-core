pragma solidity 0.5.16;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "../../uniswap/interfaces/IUniswapV2Router02.sol";
import "../../uniswap/interfaces/IUniswapV2Pair.sol";
import "../../contracts/hardworkInterface/IStrategy.sol";
import "../../contracts/hardworkInterface/IVault.sol";
import "./BaseUpgradeableStrategy.sol";
import "./IMiniChefV2.sol";

contract MasterChefHodlStrategy is IStrategy, BaseUpgradeableStrategy {

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // additional storage slots (on top of BaseUpgradeableStrategy ones) are defined here
  bytes32 internal constant _POOLID_SLOT = 0x3fd729bfa2e28b7806b03a6e014729f59477b530f995be4d51defc9dad94810b;
  bytes32 internal constant _HODLVAULT_SLOT = 0xc26d330f887c749cb38ae7c37873ff08ac4bba7aec9113c82d48a0cf6cc145f2;
  bytes32 internal constant _FEERATIO_SLOT = 0xdd068d8a32502e81a10cdf5394059be07ccd47fe6df7741b57a2f9937efedeaf;
  bytes32 internal constant _FEEHOLDER_SLOT = 0x00679b6f1cace16785324a171df0e550ee9f20b64671a53b5c491a3065b30f2b;
  bytes32 internal constant _ROUTER_ADDRESS_V2_SLOT = 0x92199eab42483f175b95375c69585e82b184587d7846fbeb28030f68fbdf2feb;
  bytes32 internal constant _SUSHI_TOKEN_ADDRESS_SLOT = 0xcf3b156443750e93863e4613b74db96a0f6b1a281dd67c87ff4afda1c52d545a;
  bytes32 internal constant _WMATIC_TOKEN_ADDRESS_SLOT = 0x9b943037a3ba4823127740ffb7abf7566d132d3c50fe28fa8fd45de2c2a6f834;
  bytes32 internal constant _SELL_SUSHI_BOOL_SLOT = 0xb404b34be2ff9c417c92ed70e602d3743dc67c81ec3e52a56e152248436e66f2;
  bytes32 internal constant _SELL_MATIC_BOOL_SLOT = 0x73f61035ecc9fe9b9df7f01bc4f1011784dd694ac3cac759bcd208fbf3da6e4a;
  bytes32 internal constant _CLAIM_ALLOWED_BOOL_SLOT = 0x643da254e9d7470053896c065c0a957d88a3eb48e03c87bfdfe16b3b5282046a;
  bytes32 internal constant _FEE_BASE_UNIT256_SLOT = 0xb03ba70f2714416bbb89d5653110256725bbfd3c1a0a6334c283e953a6ea7993;
 
  //Wmatic -> WETH paths[0]
  bytes32 internal constant _ROUTE_WMATIC_TOKEN0_LHS = 0x6565901a24447709405ab3697f2ea640ce7791edb0ea046095d626972d683601;
  
  //Wmatic -> WETH paths[1]
  bytes32 internal constant _ROUTE_WMATIC_ROUTE_TOKEN0_RHS = 0x900fb2a9fa2b2b2820f295064f6e6adbf7ddab98fcd6d808328c83637697bcab;

  //Wmatic -> underlying paths[0]
  bytes32 internal constant _ROUTE_WMATIC_ROUTE_TOKEN1_LHS = 0x8faa525983a40d73a9645634c5c07faf273c288aac622ba3f4b00dc2bdcc70ed;

  //Wmatic -> underlying paths[1]
  bytes32 internal constant _ROUTE_WMATIC_ROUTE_TOKEN1_RHS = 0x11715c74c260a518c242046509eb0522741596bbc940b2effdc1424b13e585fd;

  //SUSHI -> WETH paths[0]
  bytes32 internal constant _ROUTE_SUSHI_ROUTE_TOKEN0_LHS = 0x525d87f3a88df1e5365945ad2b18acddb07378fd70f898bf731c21f78fe2f23b;

  //SUSHI -> WETH paths[1]
  bytes32 internal constant _ROUTE_SUSHI_ROUTE_TOKEN0_RHS = 0x158eb59ee802a12ccb51e0e690e309c49ee37438bb1ded3c31f09ac4348b2923;

  //SUSHI -> underlying paths[0]
  bytes32 internal constant _ROUTE_SUSHI_ROUTE_TOKEN1_LHS = 0x05bbcb07ee015ebbef26793b36c0acd7e35b0da4e41c9be77244c04eb97ad92a;

  //SUSHI -> underlying paths[1]
  bytes32 internal constant _ROUTE_SUSHI_ROUTE_TOKEN1_RHS = 0xab89abbedde2addb80dde4b5025427e94813c85004af27ed6a3d14614e675d5a;

  constructor() public BaseUpgradeableStrategy() {
    assert(_POOLID_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.poolId")) - 1));
    assert(_HODLVAULT_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.hodlVault")) - 1));
    assert(_FEERATIO_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeRatio")) - 1));
    assert(_FEEHOLDER_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeHolder")) - 1));
    assert(_ROUTER_ADDRESS_V2_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.routerAddressV2")) - 1));
    assert(_SUSHI_TOKEN_ADDRESS_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sushiTokenAddress")) - 1));
    assert(_WMATIC_TOKEN_ADDRESS_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.wmaticTokenAddress")) - 1));
    assert(_SELL_SUSHI_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sellSushi")) - 1));
    assert(_SELL_MATIC_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.sellMatic")) - 1));
    assert(_CLAIM_ALLOWED_BOOL_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.claimAllowed")) - 1));
    assert(_FEE_BASE_UNIT256_SLOT == bytes32(uint256(keccak256("eip1967.strategyStorage.feeBase")) - 1));

    assert(_ROUTE_WMATIC_TOKEN0_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token0.lhs")) - 1));
    assert(_ROUTE_WMATIC_TOKEN0_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token0.rhs")) - 1));

    assert(_ROUTE_WMATIC_TOKEN1_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token1.lhs")) - 1));
    assert(_ROUTE_WMATIC_TOKEN1_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.wmatic.token1.rhs")) - 1));

    assert(_ROUTE_SUSHI_TOKEN0_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token0.lhs")) - 1));
    assert(_ROUTE_SUSHI_TOKEN0_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token0.rhs")) - 1));
    
    assert(_ROUTE_SUSHI_TOKEN1_LHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token1.lhs")) - 1));
    assert(_ROUTE_SUSHI_TOKEN1_RHS == bytes32(uint256(keccak256("eip1967.strategyStorage.route.sushi.token1.rhs")) - 1));
  }

  function initializeMasterChefHodlStrategy(
    address _storage,
    address _underlying,
    address _vault,
    address _rewardPool,
    uint256 _poolId,
    address _hodlVault,
    address _routerAddressV2,
    address _sushiTokenAddress,
    address _wmaticTokenAddress
    address _routeWmaticToken0Lhs,
    address _routeWmaticToken0Rhs,
    address _routeWmaticToken1Lhs,
    address _routeWmaticToken1Rhs,
    address _routeSushiToken0Lhs,
    address _routeSushiToken0Rhs,
    address _routeSushiToken1Lhs,
    address _routeSushiToken1Rhs
  ) public initializer {
    require(_rewardPool != address(0), "reward pool is empty");
    require(_poolId != uint256(0), "_poolId is Zero");
    require(_hodlVault != address(0), "_hodlVault is empty");
    require(_routerAddressV2 != address(0), "routerAddressV2 is empty");

    BaseUpgradeableStrategy.initialize(
      _storage,
      _underlying,
      _vault,
      _rewardPool,
      300, // profit sharing numerator
      1000, // profit sharing denominator
      true, // sell
      1e18, // sell floor
      12 hours // implementation change delay
    );

    setUint256(_FEE_BASE_UNIT256_SLOT, 1000);
    
    IMiniChefV2.PoolInfo memory poolInfo = IMiniChefV2(rewardPool()).poolInfo(_poolId);
    address _lpt = poolInfo.lpToken; 
    require(_lpt == underlying(), "Pool Info does not match underlying");
    setUint256(_POOLID_SLOT, _poolId);
    setAddress(_HODLVAULT_SLOT, _hodlVault);
    setAddress(_ROUTER_ADDRESS_V2_SLOT, _routerAddressV2);
    setAddress(_SUSHI_TOKEN_ADDRESS_SLOT, _sushiTokenAddress);
    setAddress(_WMATIC_TOKEN_ADDRESS_SLOT, _wmaticTokenAddress);

    setAddress(_ROUTE_WMATIC_TOKEN0_LHS, _routeWmaticToken0Lhs);
    setAddress(_ROUTE_WMATIC_TOKEN0_RHS, _routeWmaticToken0Rhs);
    setAddress(_ROUTE_WMATIC_TOKEN1_LHS, _routeWmaticToken1Lhs);
    setAddress(_ROUTE_WMATIC_TOKEN1_RHS, _routeWmaticToken1Rhs);

    setAddress(_ROUTER_SUSHI_TOKEN0_LHS, _routeSushiToken0Lhs);
    setAddress(_ROUTER_SUSHI_TOKEN0_RHS, _routeSushiToken0Rhs);
    setAddress(_ROUTER_SUSHI_TOKEN1_LHS, _routeSushiToken1Lhs);
    setAddress(_ROUTER_SUSHI_TOKEN1_RHS, _routeSushiToken1Rhs);
  }

  function getWMaticRoutes() public view returns (address[], address[]){

    address[] wmaticToken0Route = new address[](2);
    address wmaticToken0Lhs = getAddress(_ROUTE_WMATIC_TOKEN0_LHS)
    wmaticToken0Route[0] = wmaticToken0Lhs;
    address wmaticToken0Rhs = getAddress(_ROUTE_WMATIC_TOKEN0_RHS)
    wmaticToken0Route[1] = wmaticToken0Rhs;

    address[] wmaticToken1Route = new address[](2);
    address wmaticToken1Lhs = getAddress(_ROUTE_WMATIC_TOKEN1_LHS)
    wmaticToken1Route[0] = wmaticToken1Lhs;
    address wmaticToken1Rhs = getAddress(_ROUTE_WMATIC_TOKEN1_LHS)
    wmaticToken1Route[1] = wmaticToken1Rhs;

    return (wmaticToken0Route, wmaticToken1Route);
  }


  function getSushiRoutes() public view returns (address[], address[]){

    address[] sushiToken0Route = new address[](2);
    address sushiToken0Lhs = getAddress(_ROUTE_SUSHI_TOKEN0_LHS)
    sushiToken0Route[0] = sushiToken0Lhs;
    address sushiToken0Rhs = getAddress(_ROUTE_SUSHI_TOKEN0_RHS)
    sushiToken0Route[1] = sushiToken0Rhs;

    address[] sushiToken1Route = new address[](2);
    address sushiToken1Lhs = getAddress(_ROUTE_SUSHI_TOKEN1_LHS)
    sushiToken1Route[0] = sushiToken1Lhs;
    address sushiToken1Rhs = getAddress(_ROUTE_SUSHI_TOKEN1_LHS)
    sushiToken1Route[1] = sushiToken1Rhs;
    
    return (sushiToken0Route, sushiToken1Route);
  }

  function depositArbCheck() public view returns(bool) {
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

  function unsalvagableTokens(address token) public view returns (bool) {
    return (token == sushiTokenAddress() || token == wmaticTokenAddress() || token == underlying());
  }

  function enterRewardPool() internal {
    uint256 entireBalance = IERC20(underlying()).balanceOf(address(this));
    IERC20(underlying()).safeApprove(rewardPool(), 0);
    IERC20(underlying()).safeApprove(rewardPool(), entireBalance);
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

  //liquidate the Sushi Rewards
  if (sellSushi()) {
    liquidateRewardToken(sushiTokenAddress());
  }

  //liquidate the WMatic Rewards
  if (sellMatic()) {
    liquidateRewardToken(wmaticTokenAddress());
  }

      // uint256 rewardBalance = IERC20(rewardToken()).balanceOf(address(this));
      // if(rewardBalance > 0) {
      //   uint256 fee = 0;
      //   uint256 remainingReward = rewardBalance;
      //   if(feeHolder() != address(0)){
      //     fee = rewardBalance.mul(feeRatio()).div(feeBase());
      //     remainingReward = rewardBalance.sub(fee);
      //     if(fee > 0){
      //       IERC20(rewardToken()).safeTransfer(feeHolder(), fee);
      //     }
      //   }

      //   IERC20(rewardToken()).safeApprove(hodlVault(), 0);
      //   IERC20(rewardToken()).safeApprove(hodlVault(), remainingReward);



      //   IVault(hodlVault()).deposit(remainingReward);
      //   uint256 fRewardBalance = IERC20(hodlVault()).balanceOf(address(this));
      //   IERC20(hodlVault()).safeTransfer(controller(), fRewardBalance);
    }
  }

   function liquidateRewardToken(address _rewardTokenAddress, address[] _uniswapPath) internal {
        uint256 _rewardTokenBalance = IERC20(_rewardTokenAddress).balanceOf(address(this));
        if (_rewardTokenBalance > 0) {
            emit Liquidating(address(_rewardTokenAddress), _rewardTokenBalance);
            IERC20(_rewardTokenAddress).safeApprove(uniswapRouterV2, 0);
            IERC20(_rewardTokenAddress).safeApprove(uniswapRouterV2, _rewardTokenBalance);
            // we can accept 1 as the minimum because this will be called only by a trusted worker
            IUniswapV2Router02(routerAddressV2()).swapExactTokensForTokens(
                _rewardTokenBalance,
                1,
                _uniswapPath,
                address(this),
                block.timestamp
            );
        }
    }

  /*
  *   Stakes everything the strategy holds into the reward pool
  */
  function investAllUnderlying() internal onlyNotPausedInvesting {
    // this check is needed, because most of the SNX reward pools will revert if
    // you try to stake(0).
    if(IERC20(underlying()).balanceOf(address(this)) > 0) {
      enterRewardPool();
    }
  }

  /*
  *   Withdraws all the asset to the vault
  */
  function withdrawAllToVault() public restricted {
    exitRewardPool();
    _hodlAndNotify();
    IERC20(underlying()).safeTransfer(vault(), IERC20(underlying()).balanceOf(address(this)));
  }

  /*
  *   Withdraws all the asset to the vault
  */
  function withdrawToVault(uint256 amount) public restricted {
    // Typically there wouldn't be any amount here
    // however, it is possible because of the emergencyExit
    uint256 entireBalance = IERC20(underlying()).balanceOf(address(this));

    if(amount > entireBalance){
      // While we have the check above, we still using SafeMath below
      // for the peace of mind (in case something gets changed in between)
      uint256 needToWithdraw = amount.sub(entireBalance);
      uint256 toWithdraw = Math.min(rewardPoolBalance(), needToWithdraw);
      IMiniChefV2(rewardPool()).withdraw(poolId(), toWithdraw, address(this));
    }

    IERC20(underlying()).safeTransfer(vault(), amount);
  }

  /*
  *   Note that we currently do not have a mechanism here to include the
  *   amount of reward that is accrued.
  */
  function investedUnderlyingBalance() external view returns (uint256) {
    if (rewardPool() == address(0)) {
      return IERC20(underlying()).balanceOf(address(this));
    }
    // Adding the amount locked in the reward pool and the amount that is somehow in this contract
    // both are in the units of "underlying"
    // The second part is needed because there is the emergency exit mechanism
    // which would break the assumption that all the funds are always inside of the reward pool
    return rewardPoolBalance().add(IERC20(underlying()).balanceOf(address(this)));
  }

  /*
  *   Governance or Controller can claim coins that are somehow transferred into the contract
  *   Note that they cannot come in take away coins that are used and defined in the strategy itself
  */
  function salvage(address recipient, address token, uint256 amount) external onlyControllerOrGovernance {
     // To make sure that governance cannot come in and take away the coins
    require(!unsalvagableTokens(token), "token is defined as not salvagable");
    IERC20(token).safeTransfer(recipient, amount);
  }

  /*
  *   Get the reward, sell it in exchange for underlying, invest what you got.
  *   It's not much, but it's honest work.
  *
  *   Note that although `onlyNotPausedInvesting` is not added here,
  *   calling `investAllUnderlying()` affectively blocks the usage of `doHardWork`
  *   when the investing is being paused by governance.
  */
  function doHardWork() external onlyNotPausedInvesting restricted {
    exitRewardPool();
    _hodlAndNotify();
    investAllUnderlying();
  }

  function hodlVault() public view returns (address) {
    return getAddress(_HODLVAULT_SLOT);
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

  function setSellSushi(bool _sellSushi) internal {
    setBoolean(_SELL_SUSHI_BOOL_SLOT, _sellSushi);
  }

  function sellSushi() public view returns (bool) {
    return getBoolean(_SELL_SUSHI_BOOL_SLOT);
  }

  function setSellMatic(bool _sellMatic) internal {
    setBoolean(_SELL_MATIC_BOOL_SLOT, _sellMatic);
  }

  function sellMatic() public view returns (bool) {
    return getBoolean(_SELL_MATIC_BOOL_SLOT);
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

  function setLiquidation(
      bool _sellSushi,
      bool _sellMatic,
      bool _claimAllowed
  ) public onlyGovernance {
      setSushi(_sellSushi);
      setMatic(_sellMatic);
      setClaimAllowed(_claimAllowed);
  }
}
