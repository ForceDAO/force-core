//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../hardworkInterface/IVault.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockVaultDepositor {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    function depositFor(
        IERC20 underlying,
        IVault vault,
        uint256 amount
    ) public {
        underlying.safeTransferFrom(msg.sender, address(this), amount);
        underlying.safeApprove(address(vault), amount);
        vault.depositFor(amount, msg.sender);
    }

    function deposit(
        IERC20 underlying,
        IVault vault,
        uint256 amount
    ) public {
        underlying.safeTransferFrom(msg.sender, address(this), amount);
        underlying.safeApprove(address(vault), amount);
        vault.deposit(amount);
    }

    function depositAndWithdraw(
        IERC20 underlying,
        IVault vault,
        uint256 amount
    )
        external
    {
        deposit(underlying, vault, amount);
        vault.withdraw(amount);
    }

    function depositForAndWithdraw(
        IERC20 underlying,
        IVault vault,
        uint256 amount
    )
        external
    {
        depositFor(underlying, vault, amount);
        vault.withdraw(amount);
    }
}
