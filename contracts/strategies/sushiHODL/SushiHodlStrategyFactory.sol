pragma solidity ^0.8.0;

import "./MasterChefHodlStrategy.sol";

contract SushiHodlStrategyFactory {

  address public abc_xyz_unused; // just a differentiator for the bytecode

  event LogSushiHodlStrategyCreated(
      address _storage,
      address _underlyingPair,
      address _vault,
      address _masterChef,
      address _sushiToken,
      uint256 _poolId,
      address _fsushi,
      address _uniswapRouterV2Address,
      address _sushiswapRouterV2Address
  );

  //   function initializeMasterChefHodlStrategy(
  //   address _storage,
  //   address _underlying,
  //   address _vault,
  //   address _rewardPool,
  //   uint256 _poolId,
  //   address _hodlVault,
  //   address _routerAddressV2,
  //   address _sushiTokenAddress,
  //   address _wmaticTokenAddress
  //   address[] _routeWmaticToken0,
  //   address[] _routeWmaticToken1,
  //   address[] _routeSushiToken0,
  //   address[] _routeSushiToken1,
  // ) public initializer {

  function createSushiHodlStrategy(
    address _storage,
    address _underlyingPair,
    address _vault,
    address _masterChef, // _rewardPool
    address _sushiToken,    // _rewardToken
    uint256 _poolId,  // Sushi reward pool id
    address _fsushi //_hodlVault Sushi hodlVault fsushi
    address _uniswapRouterV2Address,
    address _sushiswapRouterV2Address
  ) public returns(address) {
    MasterChefHodlStrategy addrNew = new MasterChefHodlStrategy();

    MasterChefHodlStrategy(address(addrNew)).initializeMasterChefHodlStrategy(
      _storage,
      _underlyingPair,
      _vault,
      _masterChef,
      _sushiToken,
      _poolId,
      _fsushi,
      address(0x0000000000000000000000000000000000000000) // manually set it later,
      _uniswapRouterV2Address,
      _sushiswapRouterV2Address
    );
    emit LogSushiHodlStrategyCreated(
        _storage,
        _underlyingPair,
        _vault,
        _masterChef,
        _sushiToken,
        _poolId,
        _fsushi,
        _uniswapRouterV2Address,
       _sushiswapRouterV2Address
    );
    return address(addrNew);
  }
}