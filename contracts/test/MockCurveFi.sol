//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./strategiesCurveInterfaces/ICurveFi.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MockToken.sol";

contract MockCurveFi is ICurveFi {

  IERC20 underlying;
  MockToken public ycrv;
  uint256 index;

  constructor(address _underlying, uint256 _index) {
    index = _index;
    underlying = IERC20(_underlying);
    ycrv = new MockToken();
  }

  function setYcrv(address token) public  {
    ycrv = MockToken(token);
  }

  function get_virtual_price() external view override returns (uint) {
    return 0;
  }

  function add_liquidity(
    uint256[4] calldata amounts,
    uint256 min_mint_amount
  ) external override {
    underlying.transferFrom(msg.sender, address(this), amounts[index]);
    ycrv.mint(msg.sender, amounts[index]);
    require(amounts[index] >= min_mint_amount);
  }

  event DD(string a, uint256 b);
  function remove_liquidity_imbalance(
    uint256[4] calldata amounts,
    uint256 max_burn_amount
  ) external override {
    emit DD("nder balance before before burn", underlying.balanceOf(address(this)));
    emit DD("transferring before burn", amounts[index]);
    underlying.transfer(msg.sender, amounts[index]);
    emit DD("want to burn", amounts[index]);
    if (ycrv.balanceOf(msg.sender) < amounts[index]) {
      emit DD("Burn overflow trying", amounts[index]);
      emit DD("have only", ycrv.balanceOf(msg.sender));
    } else {
      ycrv.burnFrom(msg.sender, amounts[index]);
    }
    require(amounts[index] <= max_burn_amount);
  }

  function remove_liquidity(
    uint256 _amount,
    uint256[4] calldata amounts
  ) external override {
  }

  function exchange(
    int128 from, int128 to, uint256 _from_amount, uint256 _min_to_amount
  ) external override {
  }

  function calc_token_amount(
    uint256[4] calldata amounts,
    bool deposit
  ) external view override returns(uint) {
    return amounts[index];
  }
}
