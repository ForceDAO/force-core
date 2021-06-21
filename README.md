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

## Addresses

### Deployer, Minters, Treasuries

| Name | Address | Description |
|:---|:--:|:---|
| Governance | [0x0aF0625b772472d18825c104b9daE35f76d3f6E0][es-governance] | Administers contracts |
| Controller | [0x0aF0625b772472d18825c104b9daE35f76d3f6E0][es-controller] | Receives fees and conducts limited administration |
| Developer Fund | [0x0aF0625b772472d18825c104b9daE35f76d3f6E0][es-dev] | Currently same as Controller address |
| Operational Treasury | [0xe5b5514e0618f4B55736c0c0C78CCD6F8AC14631][es-ops] | Primary Project Treasury |
| FORCE Token | [0x2c31b10ca416b82cec4c5e93c615ca851213d48d][es-token] | FORCE Token |

[es-governance]: https://etherscan.io/address/0xf00dd244228f51547f0563e60bca65a30fbf5f7f
[es-controller]: https://etherscan.io/address/0x0aF0625b772472d18825c104b9daE35f76d3f6E0
[es-dev]: https://etherscan.io/address/0x0aF0625b772472d18825c104b9daE35f76d3f6E0
[es-ops]: https://etherscan.io/address/0xe5b5514e0618f4B55736c0c0C78CCD6F8AC14631
[es-token]: https://etherscan.io/address/0x2c31b10ca416b82cec4c5e93c615ca851213d48d

### Storage

| Storage | [0x][es-storage] | Root Storage |

### Vaults:

| Vault             | Receipt		| Underlying		| Vault Contract Address 					 | Underlying Address						  |
|:------------------|:--------------|:------------------|:-------------------------------------------|:-------------------------------------------|
|--Polygon		|
| xxx-xx			| xxx 	| xxx			| [0x][es-xxx] | [0x][es-xxx] |


[//]: # (Vault addresses)
[es-xxx]: https://etherscan.io/address/0x0


### Strategies:

[//]: # (Strategies)
[es-xxx]: https://etherscan.io/address/0x0
