pragma solidity ^0.8.0;

//TODO - can change the name to MiniChefV2 as we gonna use the MiniChefV2 Address
//TODO - Sync with the functions of the MiniChefV2
//TODO -  MiniChefV2 Matic Address is: https://explorer-mainnet.maticvigil.com/address/0x0769fd68dFb93167989C6f7254cd0D766Fb2841F/contracts
interface IMasterChef {
    function deposit(uint256 _pid, uint256 _amount, address to) external;
    function withdraw(uint256 _pid, uint256 _amount) external;
    function emergencyWithdraw(uint256 _pid) external;
    function userInfo(uint256 _pid, address _user) external view returns (uint256 amount, uint256 rewardDebt);
    function poolInfo(uint256 _pid) external view returns (address lpToken, uint256, uint256, uint256);
    function massUpdatePools() external;
}
