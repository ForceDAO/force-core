pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUNI is ERC20,  ERC20Mintable {

  constructor() public ERC20("Uniswap LP Token", "UNISWAP_LP", 18)  {
  }
}
