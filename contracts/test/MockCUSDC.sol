//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

abstract contract MockCUSDC is ERC20Burnable, ERC20PresetMinterPauser {

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  uint256 constant public supplyNum = 5; // 5% on supply
  uint256 constant public supplyDenom = 100;
  uint256 constant public borrowNum = 10; // 10% on borrow
  uint256 constant public borrowDenom = 100;
  uint256 constant public ratioNum = 75;
  uint256 constant public ratioDenom = 100;
  IERC20 public underlying;
  mapping(address => uint256) debt;

  constructor(address _underlying) {
    underlying = IERC20(_underlying);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20PresetMinterPauser) { }

  function mint(uint256 amount) external returns (uint256) {
    underlying.transferFrom(msg.sender, address(this), amount);
    _mint(msg.sender, amount.mul(supplyNum).div(supplyDenom).add(amount));
    return 0;
  }

  function redeemUnderlying(uint256 amount) external returns (uint256) {
    burn(amount);
    underlying.transfer(msg.sender, amount);
    return 0;
  }

  function borrow(uint256 amount) external returns (uint256) {
    require(debt[msg.sender].add(amount) <= balanceOf(msg.sender).mul(ratioNum).div(ratioDenom),
      "more collateral is needed"
    );
    underlying.transfer(msg.sender, amount);
    debt[msg.sender] = debt[msg.sender].add(amount.mul(borrowNum).div(borrowDenom)).add(amount);
    return 0;
  }

  function repayBorrow(uint256 amount) external returns (uint256) {
    underlying.transferFrom(msg.sender, address(this), amount);
    debt[msg.sender] = debt[msg.sender].sub(amount);
    return 0;
  }

  function balanceOfUnderlying(address account) external view returns (uint256) {
    return balanceOf(account);
  }

  function borrowBalanceCurrent(address account) external view returns (uint256) {
    return debt[account];
  }

  function getCash() public pure returns (uint256) {
    // from compound
    return 104576645048646;
  }

  function totalBorrows() public pure returns (uint256) {
    // from compound
    return 71094422510667;
  }

  function borrowRatePerBlock() public pure returns (uint256) {
    // from compound 28762459275;
    return 30000000000;
  }

  function supplyRatePerBlock() public pure returns (uint256) {
    // from compound
    return 11067331897;
  }

  function totalBorrowsCurrent() public pure returns (uint256) {
    // 1 million for testing
    return 1000000000000;
  }
}
