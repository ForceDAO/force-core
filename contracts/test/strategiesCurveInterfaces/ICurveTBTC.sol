//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICurveTBTC {
    function add_liquidity(
        uint256[4] calldata amounts,
        uint256 min_mint_amount
    ) external returns (uint256);
}
