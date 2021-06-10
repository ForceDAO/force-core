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
/**


    // Give Multisig Control
    await forceToken.grantRole(
      utils.id("SNAPSHOT_ROLE"),
      args.multisig,
      { gasLimit: 100000 }
    );

    await forceToken.grantRole(constants.HashZero, args.multisig, {
      gasLimit: 100000,
    });


    // Renounce Control from Deployer
    await forceToken.renounceRole(
      utils.id("SNAPSHOT_ROLE"),
      mainSigner.address,
      {
        gasLimit: 100000,
      }
    );
    await forceToken.renounceRole(
      constants.HashZero,
      mainSigner.address,
      {
        gasLimit: 100000,
      }
    );

    // Transfer Tokens
    await forceToken.transfer(args.multisig, utils.parseEther("100000000"), {
      gasLimit: 100000,
    }); 


 */