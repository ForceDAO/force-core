pragma solidity ^0.8.0;

//TODO - Sync with the functions of the MiniChefV2
//TODO -  MiniChefV2 Matic Address is: https://explorer-mainnet.maticvigil.com/address/0x0769fd68dFb93167989C6f7254cd0D766Fb2841F/contracts
interface IMasterChefV2 {

    /// @notice Deposit LP tokens to MCV2 for SUSHI allocation.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param amount LP token amount to deposit.
    /// @param to The receiver of `amount` deposit benefit.
    function deposit(uint256 pid, uint256 amount, address to) external;

     /// @notice Withdraw LP tokens from MCV2.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param amount LP token amount to withdraw.
    /// @param to Receiver of the LP tokens.
    function withdraw(uint256 pid, uint256 amount, address to)
    
    /// @notice Withdraw without caring about rewards. EMERGENCY ONLY.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param to Receiver of the LP tokens.
    function emergencyWithdraw(uint256 pid, address to);

    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    function userInfo(uint256 _pid, address _user) external view returns (IMasterChefV2.UserInfo memory);


    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. SUSHI to distribute per block.
        uint256 lastRewardBlock;  // Last block number that SUSHI distribution occurs.
        uint256 accSushiPerShare; // Accumulated SUSHI per share, times 1e12. See below.
    }

    function poolInfo(uint256 pid) external view returns (IMasterChefV2.PoolInfo memory);



    /// @notice Update reward variables for all pools. Be careful of gas spending!
    /// @param pids Pool IDs of all to be updated. Make sure to update all active pools.
    function massUpdatePools(uint256[] calldata pids) external;
}