pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockWETH is ERC20, ERC20Detailed, ERC20Mintable {

  constructor() public ERC20Detailed("WETH", "WETH", 18)  {
  }
}
