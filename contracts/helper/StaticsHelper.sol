//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../hardworkInterface/IVault.sol";

contract StaticsHelper is Ownable {

    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    mapping(address => address) public priceFeeds;
    mapping(address => address) public lpSubTokens;
    mapping(address => address) public rewardPools;

    function setPriceFeed(address token, address feed) external onlyOwner {
        require(feed != address(0), "StaticsHelper: cannot set 0 address");

        priceFeeds[token] = feed;
    }

    function setLpSubToken(address token, address subToken) external onlyOwner {
        require(token != address(0), "StaticsHelper: cannot set 0 address");

        lpSubTokens[token] = subToken;
    }

    function setRewardPool(address vault, address rewardPool)
        external
        onlyOwner
    {
        require(vault != address(0), "StaticsHelper: cannot set 0 address");
        require(
            rewardPool != address(0),
            "StaticsHelper: cannot set 0 address"
        );

        rewardPools[vault] = rewardPool;
    }

    function getBalances(address[] memory tokens, address user)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory amounts = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i += 1) {
            if (tokens[i] == address(0)) {
                amounts[i] = user.balance;
            } else {
                amounts[i] = IERC20Upgradeable(tokens[i]).balanceOf(user);
            }
        }
        return amounts;
    }

    function getTotalSupplies(address[] memory tokens)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory amounts = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i += 1) {
            amounts[i] = IERC20Upgradeable(tokens[i]).totalSupply();
        }
        return amounts;
    }

    function getTokenAllowances(
        address[] memory tokens,
        address[] memory spenders,
        address user
    ) public view returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i += 1) {
            amounts[i] = IERC20Upgradeable(tokens[i]).allowance(user, spenders[i]);
        }
        return amounts;
    }

    function underlyingBalanceWithInvestment(address[] memory vaults)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory amounts = new uint256[](vaults.length);
        for (uint256 i = 0; i < vaults.length; i += 1) {
            amounts[i] = IVault(vaults[i]).underlyingBalanceWithInvestment();
        }
        return amounts;
    }

    function getChainlinkPrice(address token) public view returns (uint256) {
        if (priceFeeds[token] == address(0)) return 0;
        (, int256 price, , , ) =
            AggregatorV3Interface(priceFeeds[token]).latestRoundData();
        uint256 decimals =
            uint256(AggregatorV3Interface(priceFeeds[token]).decimals());
        uint256 uPrice = uint256(price);
        if (decimals < 18) {
            return uPrice.mul(10**(18 - decimals));
        } else if (decimals > 18) {
            return uPrice.div(10**(decimals - 18));
        }
        return uPrice;
    }

    function getLPPrice(address lp) public view returns (uint256) {
        if (lpSubTokens[lp] == address(0)) return 0;
        address subToken = lpSubTokens[lp];
        uint256 subTokenPrice = getChainlinkPrice(subToken);
        address _lp = lp;
        uint256 lpPrice =
            IERC20Upgradeable(subToken)
                .balanceOf(_lp)
                .mul(2)
                .mul(subTokenPrice)
                .mul(1e18)
                .div(IERC20Upgradeable(_lp).totalSupply())
                .div(10**uint256(IERC20Metadata(subToken).decimals()));
        return lpPrice;
    }

    function getPrices(address[] memory tokens)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory amounts = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i += 1) {
            amounts[i] = getPrice(tokens[i]);
        }
        return amounts;
    }

    function getPrice(address token) public view returns (uint256) {
        if (priceFeeds[token] != address(0)) {
            return getChainlinkPrice(token);
        }
        if (lpSubTokens[token] != address(0)) {
            return getLPPrice(token);
        }
        return 0;
    }

    function getPortfolio(address[] memory tokens, address user)
        public
        view
        returns (uint256)
    {
        uint256 portfolio;
        uint256[] memory balances = getBalances(tokens, user);
        uint256[] memory prices = getPrices(tokens);
        for (uint256 i = 0; i < tokens.length; i += 1) {
            portfolio = portfolio.add(
                prices[i].mul(balances[i]).div(
                    10**uint256(IERC20Metadata(tokens[i]).decimals()))
            );
        }
        return portfolio;
    }

    function getTVL(address[] memory vaults) public view returns (uint256) {
        uint256 tvl;
        for (uint256 i = 0; i < vaults.length; i += 1) {
            uint256 price = getPrice(IVault(vaults[i]).underlying());
            uint256 investment =
                IVault(vaults[i]).underlyingBalanceWithInvestment();
            tvl = tvl.add(price.mul(investment));
        }
        return tvl;
    }
}