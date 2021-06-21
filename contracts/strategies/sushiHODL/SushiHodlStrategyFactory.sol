//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./MasterChefHodlStrategy.sol";

contract SushiHodlStrategyFactory {

  /// @param _masterChefHodlStrategyAddress newly created and initialised masterChefHodlStrategy
  event LogSushiHodlStrategyCreated(
    address indexed _masterChefHodlStrategyAddress
  );

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
  function createSushiHodlStrategy(
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
  ) public {
    MasterChefHodlStrategy masterChefHodlStrategy = new MasterChefHodlStrategy();
    MasterChefHodlStrategy(address(masterChefHodlStrategy)).initializeMasterChefHodlStrategy(
      _storage,
      _underlying,
      _vault,
      _miniChefV2,
      _poolId,
      _routerAddressV2,
      _sushiTokenAddress,
      _wmaticTokenAddress,
      _routeSushiToken0,
      _routeSushiToken1,
      _routeWmaticToken0,
      _routeWmaticToken1
    );

    emit LogSushiHodlStrategyCreated(address(masterChefHodlStrategy));
  }
}