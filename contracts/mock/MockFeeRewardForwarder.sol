//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "../Governable.sol";

contract MockFeeRewardForwarder is Governable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public force;
    address public profitSharingPool;

    constructor(
        address _storage,
        address _force,
        address _profitSharingPool
    ) Governable(_storage) {
        require(_force != address(0), "_force not defined");
        force = _force;
        profitSharingPool = _profitSharingPool;
    }

    function poolNotifyFixedTarget(address _token, uint256 _amount) external {
        IERC20(_token).safeTransferFrom(msg.sender, profitSharingPool, _amount);
    }
}
