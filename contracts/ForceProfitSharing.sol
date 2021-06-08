//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ForceProfitSharing is ERC20Upgradeable,  ReentrancyGuardUpgradeable {
    using SafeMathUpgradeable for uint256;
    IERC20Upgradeable public force;

    event Withdraw(address indexed beneficiary, uint256 amount);
    event Deposit(address indexed beneficiary, uint256 amount);

    // Define the Force token contract
    function initialize(address _underlying) public initializer {
        force = IERC20Upgradeable(_underlying);
        ERC20Upgradeable.__ERC20_init(
            "xFORCE",
            "xFORCE"
        );//ERC20Detailed(_underlying).decimals()

        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
    }

    function deposit(uint256 amount) external nonReentrant {
        // Gets the amount of Force locked in the contract
        uint256 totalForce = force.balanceOf(address(this));
        // Gets the amount of xForce in existence
        uint256 totalShares = totalSupply();
        // If no xForce exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalForce == 0) {
            _mint(msg.sender, amount);
        }
        // Calculate and mint the amount of xForce the Force is worth. The ratio will change overtime, as xForce is burned/minted and Force deposited + gained from fees / withdrawn.
        else {
            uint256 what = amount.mul(totalShares).div(totalForce);
            _mint(msg.sender, what);
        }
        // Lock the Force in the contract
        require(
            force.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 numberOfShares) external nonReentrant {
        // Gets the amount of xForce in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Force the xForce is worth
        uint256 what =
            numberOfShares.mul(force.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, numberOfShares);
        require(force.transfer(msg.sender, what), "Transfer failed");

        emit Withdraw(msg.sender, what);
    }
}
