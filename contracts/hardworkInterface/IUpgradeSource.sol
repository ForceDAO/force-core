//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IUpgradeSource {
  function shouldUpgrade() external view returns (bool, address);
  function finalizeUpgrade() external;
}
