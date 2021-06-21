//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IController {
    // [whiteList]
    // An EOA can safely interact with the system no matter what.
    // If you're using Metamask, you're using an EOA.
    // Only smart contracts may be affected by this whiteList.
    //
    // Only smart contracts added to the whiteList may interact with the vaults.
    function whiteList(address _target) external view returns(bool);

    function addVaultAndStrategy(address _vault, address _strategy) external;
    function doHardWork(address _vault, uint256 hint, uint256 devianceNumerator, uint256 devianceDenominator) external;
    function hasVault(address _vault) external returns(bool);

    function salvage(address _token, uint256 amount) external;
    function salvageStrategy(address _strategy, address _token, uint256 amount) external;

    function notifyFee(address _underlying, uint256 fee) external;
    function profitSharingNumerator() external view returns (uint256);
    function profitSharingDenominator() external view returns (uint256);

    //functions for sushiHODL Strategy
    function feeRewardForwarder() external view returns(address);
    function setFeeRewardForwarder(address _value) external;

    function addHardWorker(address _worker) external;

}
