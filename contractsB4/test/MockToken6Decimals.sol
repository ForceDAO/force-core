pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockToken6Decimals is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {

  constructor() public ERC20Detailed("Mock Token", "MOCK", 6)  {
  }
}
