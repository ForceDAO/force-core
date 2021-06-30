pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../hardworkInterface/IVault.sol";
import "../hardworkInterface/IStrategy.sol";
import "../Controllable.sol";

contract MockVaultDepositor {
  using SafeERC20Upgradeable for IERC20Upgradeable;
    using Address for address;
    using SafeMathUpgradeable for uint256;

    function depositFor(
        IERC20Upgradeable underlying,
        IVault vault,
        uint256 amount
    ) external {
        underlying.safeTransferFrom(msg.sender, address(this), amount);
        underlying.safeApprove(address(vault), amount);
        vault.depositFor(amount, msg.sender);
    }

    function deposit(
        IERC20Upgradeable underlying,
        IVault vault,
        uint256 amount
    ) external {
        underlying.safeApprove(address(vault), amount);
        vault.deposit(amount);
    }
}
