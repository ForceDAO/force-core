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

  function createSushiHodlStrategy(
    address _storage,
    address _underlyingPair,
    address _vault,
    address _masterChef, // _rewardPool
    uint256 _poolId,  // Sushi reward pool id
    address _fsushi //_hodlVault Sushi hodlVault fsushi
    address _routerAddressV2, //uniswap Router
    address _sushiTokenAddress, //sushi tokenAddress
    address _wmaticTokenAddress, //wmatic tokenAddress
    address[] _routeWmaticToken0, //wmatic->pool-token0 route
    address[] _routeWmaticToken1, //wmatic->pool-token1 route
    address[] _routeSushiToken0, //sushi->pool-token0 route
    address[] _routeSushiToken1 //sushi->pool-token0 route
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
      _uniswapRouterV2Address
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