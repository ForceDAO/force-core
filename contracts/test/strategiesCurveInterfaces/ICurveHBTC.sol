//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICurveHBTC {
    function add_liquidity(
        uint256[2] calldata amounts,
        uint256 min_mint_amount
    ) external;
}
