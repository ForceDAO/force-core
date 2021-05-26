const { logDeployment, toWei, fromWei, log1 } = require("./utils");

// npx hardhat compile
// npx hardhat deploy-staticsHelper --network polygonmumbai
task("deploy-staticsHelper", "Deploys a new StaticsHelper contract")
  .setAction(async (args, hre) => {
    log1("\n---------== deploy-StaticsHelper");
    const ctrtName = "StaticsHelper";
    const ctrtPath = "StaticsHelper";
    log1("ctrtPath:", ctrtPath, ", ctrtName:", ctrtName);

    const factoryCtrt = await hre.ethers.getContractFactory(`${ctrtName}`); //contracts/${ctrtPath}.sol:${ctrtName}
    log1("check2");
    const StaticsHelperInstance = await factoryCtrt.deploy();

    const priceFeeds = [
      {
        token: '0x0000000000000000000000000000000000000000', // ETH
        feed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      },
      {
        token: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        feed: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
      },
      {
        token: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        feed: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
      },
      {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        feed: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
      },
    ];
    const lpTokens = [
      {
        token: '0x06da0fd433C1A5d7a4faa01111c044910A184553', // ETH/USDT
        subToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      },
      {
        token: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', // ETH/USDC
        subToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      },
      {
        token: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f', // ETH/DAI
        subToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      },
    ];
    const stakingPools = [
      {
        vault: '0xE43a0Ac0DeB85C902044c46D4556C06949788f48',
        pool: '0xDAa207f43B3F31f14216A181047EC0D596DD1713',
      },
      {
        vault: '0xF0b8F104426D75a096b1B4E218A84334159FFA1A',
        pool: '0x2E411e3c25CA31a2811d8B85c9f7A9a3f4826C8e',
      },
      {
        vault: '0xb3C85ae0C401D08c41720be94f0A797cfE8C8847',
        pool: '0xC7A9B95b15056CAF5B8FA551b3bC3e10c7798FEf',
      },
      {
        vault: '0xC6961B88fD9B9C7e6A345821250a67E8e9CAb73c',
        pool: '0x5Bf886f98d83E53AAB06f831b8A153430de6c847',
      },
      {
        vault: '0x51654a8c04e97424724E1643d468b51924f6C40F',
        pool: '0x45E60E1bee16Df15f2b87F15F2Acba6F3869462c',
      },
      {
        vault: '0xfd9EeC2Bb8Ed6051Ba557100Ad0Aba87934B51A3',
        pool: '0xe87e8E44fA0eE3aBDf10fc2c719Fc9ffDdB48b5F',
      },
      {
        vault: '0xC2C505613AAcA4D5F333D3a4E0177e99Fe233C37',
        pool: '0x469034dc349101007903A0e99F2A2569c2130CbB',
      },
    ];
    for (let i = 0; i < priceFeeds.length; i += 1) {
      await StaticsHelperInstance.setPriceFeed(
        priceFeeds[i].token,
        priceFeeds[i].feed,
      );
    }
    for (let i = 0; i < lpTokens.length; i += 1) {
      await StaticsHelperInstance.setLpSubToken(
        lpTokens[i].token,
        lpTokens[i].subToken,
      );
    }
    for (let i = 0; i < stakingPools.length; i += 1) {
      await StaticsHelperInstance.setRewardPool(
        stakingPools[i].vault,
        stakingPools[i].pool,
      );
    }

  });

module.exports;
