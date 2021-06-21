# Force DAO

First, credit where credit is due. This repo is a fork of [https://harvest.finance/](https://harvest.finance/) at commit 7c36f8b48b47ba875f1a954a0a4926ff1a13fbc1. 

Notable changes include:

  - replace controller contract with role (can be multisig)
  - hard rewards and fee forwarder removal
  - greylist to whitelist
  - supply cap
  - MasterChef strategy to MiniChefV2 strategy


## Contracts

### Storage.sol

Storage is deployed on its own and is not upgradable. `governance` and `controller` addresses stored here along with `whitelist` contract addresses.

### ControllableInit.sol & GovernableInit.sol

Upgradable, logic only, contracts. Both the use the separate storage contract for any stored data.

### Vault.sol

Notably, inherits both ControllableInit and VaultStorage. 

VaultStorage is where all of the vault's data is stored and uses the `eip1967` pattern. There should be no data stored here other than what is accessed through `eip1967` getters. Everything else is logic and getter/setter functions.

The vault is the interface to strategies. Deposits into the vaults are subsequently sent to strategies. 

