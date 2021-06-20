# V0: Scoping, Planning, and Mapping the application

## Control Objective

No customer is ever the same. So the most important thing you can do before an engagement is to have a clear understanding of your customer’s objectives.

### Planning a Smart Contract Review

- Who is the Target Audience?
- What does the business do?

### Budgeting

- If you have a large budget, you can perform a more in-depth test
- Increased timeline for testing
- Increased scope
- Increased resources (people, tech, etc.)

### Resources and Requirements

- What resources will the assessment require?

#### What requirements will be met in the testing?

- Confidentiality of findings
- Known vs. unknown vulnerabilities
- Compliance-based assessment

### Communication Paths

- Who do we communicate with about the test?
- What info will be communicated and when?
- Who is a trusted agent if testing goes wrong?

### What is the End State?

- What kind of report will be provided after test?
- Will you provide an estimate of how long remediations would take?

### Technical Constraints

- What constraints limited your ability to test?

#### Provide the status in your report

- Tested
- Not Tested
- Can’t Be Tested

### Disclaimers

- Point-in-Time Assessment
- Results were accurate when the pentest occurred

#### Comprehensiveness

- How complete was the test?
- Did you test the entire organization or only specific objectives?

### Mapping the Application

- Flatten Contracts
- Visualize the application
- Map the functions
- Review Inheritance Graph
- Review Variables and Authorization
- Review Slither Human Summary (Feature Summary)

## References

For more information, see also:

- [Pre-engagement](http://www.pentest-standard.org/index.php/Pre-engagement)
- [NIST SP 800-115 Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/publications/detail/sp/800-115/final)
- [DeFi Risk Tools List](https://github.com/defi-defense-dao/defi-risk-tools-list)
- [DeFi Security](https://github.com/OriginProtocol/security)
- [DeFi Process Quality Reviews](https://docs.defisafety.com/)
- [Process Review Audit Methodology](https://docs.defisafety.com/review-process-documentation/process-quality-audit-process)

# Rating Criteria

**Strong** - The component was reviewed and no concerns were found

**Satisfactory** - The component had only minor issues

**Moderate** - The component had some issues

**Weak** - The component led to multiple issues; more issues might be present.

# V1: Architecture, design and threat modelling

## Control Objective

Architecture, design and threat modelling in the context of creating secure smart contracts.
Consider all possible threats before the implementation of the smart contract.

Ensure that a verified contract satisfies the following high-level requirements:

- All related smart contracts are identified and used properly,
- Specific smart contracts security assumptions are considered during the design phase.

Category “V1” lists requirements related to the architecture, design and threat modelling of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **1.1** | [ ] | [ ] | Verify that the every introduced design change is preceded by an earlier threat modelling. |  Links
| **1.2** |  [ ] | [ ] | Verify that the documentation clearly and precisely defines all trust boundaries in the contract (trusted relations with other contracts and significant data flows).  |  Links
| **1.3** |  [ ] | [ ] | Verify that the SCSVS, security requirements or policy is available to all developers and testers. |  Links
| **1.4** |  [ ] | [ ] | Verify that there exists an upgrade process for the contract which allows to deploy the security fixes. |  Links
| **1.5** |  [ ] | [ ] | Verify that there is a component that monitors the contract activity using events. |  Links
| **1.6** |  [ ] | [ ] | Verify that there exists a mechanism that can temporarily stop the sensitive functionalities of the contract in case of a new attack. This mechanism should not block access to the assets (e.g. tokens) for the owners. |  Links
| **1.7** | [ ] | [ ] | Verify that there is a policy to track new security bugs and to update the libraries to the latest secure version. |  Links
| **1.8** | [ ] | [ ] | Verify that the value of cryptocurrencies kept on contract is controlled and at the minimal acceptable level. |  Links
| **1.9** | [ ] | [ ] | Verify that if the fallback function can be called by anyone it is included in the threat modelling. |  Links
| **1.10** | [ ] | [ ] | Verify that the business logic in contracts is consistent. Important changes in the logic should be allowed for all or none of the contracts. |  Links
| **1.11** | [ ] | [ ] | Verify that code analysis tools are in use that can detect potentially malicious code. |  Links
| **1.12** | [ ] | [ ] | Verify that the latest version of Solidity is used. |  Links
| **1.13** | [ ] | [ ] | Verify that, when using the external implementation of contract, you use the current version hash has not been superseded.  Links

## References

For more information, see also:

- [OWASP Threat Modeling Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Threat_Modeling_Cheat_Sheet.md)
- [OWASP Attack Surface Analysis Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.md)
- [OWASP Threat modeling](https://www.owasp.org/index.php/Application_Threat_Modeling)
- [Microsoft SDL](https://www.microsoft.com/en-us/sdl/)
- [NIST SP 800-57](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-4/final)
- [Use events to monitor contract activity](https://consensys.github.io/smart-contract-best-practices/recommendations/#use-events-to-monitor-contract-activity)
- [An example of superseded contract - EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)

# V2: Access control

## Control Objective

Access control is the process of granting or denying specific requests to obtain and use information and related information processing services.

Ensure that a verified contract satisfies the following high-level requirements:

- Users and other contracts are associated with a well-defined set of roles and privileges,
- Access is granted only to the privileged users and contracts.

Category “V2” lists requirements related to the access control mechanisms of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **2.1** | [ ] | [ ] | Verify that the principle of least privilege exists - other contracts should only be able to access functions or data for which they possess specific authorization. |  Links
| **2.2** | [ ] | [ ] | Verify that new contracts with access to the audited contract adhere to the principle of minimum rights by default. Contracts should have a minimal or no permission until access to the new features is explicitly granted. |  Links
| **2.3** | [ ] | [ ] | Verify that the creator of the contract complies with the rule of least privilege and his rights strictly follow the documentation. |  Links
| **2.4** | [ ] | [ ] | Verify that the contract enforces the access control rules specified in a trusted contract, especially if the dApp client-side access control is present (as the client-side access control can be easily bypassed). |  Links
| **2.5** | [ ] | [ ] | Verify that there is a centralized mechanism for protecting access to each type of protected resource. |  Links
| **2.6** | [ ] | [ ] | Verify that the calls to external contracts are allowed only if necessary. |  Links
| **2.7** | [ ] | [ ] | Verify that visibility of all functions is specified. |  Links
| **2.8** | [ ] | [ ] | Verify that the initialization functions are marked internal and cannot be executed twice. |  Links
| **2.9** | [ ] | [ ] | Verify that the code of modifiers is clear and simple. The logic should not contain external calls to untrusted contracts. |  Links
| **2.10** | [ ] | [ ] | Verify that the contract relies on the data provided by right sender and contract does not rely on _tx.origin_ value. |  Links
| **2.11** | [ ] | [ ] | Verify that all user and data attributes used by access controls are kept in trusted contract and cannot be manipulated by other contracts unless specifically authorized. |  Links
| **2.12** | [ ] | [ ] | Verify that the access controls fail securely including when a revert occurs. |  Links

## References

For more information, see also:

- [OWASP Cheat Sheet: Access Control](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Access_Control_Cheat_Sheet.md)
- [OpenZeppelin: Role-Based Access Control](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/852e11c2dbb19a4000decacf1840f5e4c29c5543/docs/access-control.md#role-based-access-control)

# V3: Blockchain data

## Control Objective

Smart contracts in public blockchains have no built-in mechanism to store secret data securely. It is important to protect sensitive data from reading by an untrusted actor.

Ensure that a verified contract satisfies the following high-level requirements:

- Data stored in smart contract is identified and protected,
- Secret data is not kept in blockchain as plaintext,
- Smart contract is not vulnerable due to data misrepresentation.

Category “V3” lists requirements related to the blockchain data of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **3.1** | [ ] | [ ] | Verify that any data saved in the contracts is not considered safe or private (even private variables). |  Links
| **3.2** | [ ] | [ ] | Verify that no confidential data is stored in the blockchain (passwords, personal data, token etc.). |  Links
| **3.3** | [ ] | [ ] | Verify that the list of sensitive data processed by the smart contract is identified, and that there is an explicit policy for how access to this data must be controlled and enforced under relevant data protection directives. |  Links
| **3.4** | [ ] | [ ] | Verify that there is a component that monitors access to sensitive contract data using events. |  Links
| **3.5** | [ ] | [ ] | Verify that contract does not use string literals as keys for mappings. [ ] | [ ] | [ ] | Verify that global constants are used instead to prevent Homoglyph attack. |  Links

## References

For more information, see also:

- [Homoglyph attack](https://github.com/Arachnid/uscc/tree/master/submissions-2017/marcogiglio)

# V4: Communications

## Control Objective

Communications includes the topic of the relations between smart contracts and their libraries.

Ensure that a verified contract satisfies the following high-level requirements:

- The external calls from and to other contracts have considered abuse case and are authorized,
- Used libraries are safe and the state-of-the-art security libraries are used.

Category “V4” lists requirements related to the function calls between the verified contracts and other contracts out of the scope of the application.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **4.1** | [ ] | [ ] | Verify that libraries which are not part of the application (but the smart contract relies on to operate) are identified. |  Links
| **4.2** | [ ] | [ ] | Verify that contract does not use hard-coded addresses unless necessary. If the hard coded address is used, make sure that its contract has been audited. |  Links
| **4.3** | [ ] | [ ] | Verify that contracts and libraries which call external security services have a centralized implementation. |  Links
| **4.4** | [ ] | [ ] | Verify that *delegatecall* is not used with untrusted contracts. |  Links
| **4.5** | [ ] | [ ] | Verify that re-entrancy attack is mitigated by blocking recursive calls from other contracts. Do not use *call* and *send* function unless it is a must. |  Links
| **4.6** | [ ] | [ ] | Verify that the result of low-level function calls (e.g. *send*, *delegatecall*, *call*) from another contracts is checked. |  Links
| **4.7** | [ ] | [ ] | Verify that third party contracts do not shadow special functions (e.g. *revert*). |  Links

## References

For more information, see also:

- [Security Considerations: Sending and Receiving Ether](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#sending-and-receiving-ether)
- [DASP 10: Unchecked Return Values For Low Level Calls](https://www.dasp.co/#item-4)
- [SWC-107 Reentrancy](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-107)
- [SWC-112 Delegatecall to Untrusted Callee](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-112)

# External Calls

## Control Objective

Use caution when making external calls

- Calls to untrusted contracts can introduce several unexpected risks or errors.
- External calls may execute malicious code in that contract or any other contract that it depends upon.
- Every external call should be treated as a potential security risk.
- When it is not possible, or undesirable to remove external calls, use the recommendations in the rest of this section to minimize the danger.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources |
| --- | --- | --- | --- | -- | --- |
| **4.8** | [ ] | [ ] | Verify that untrusted contracts variables, and methods are marked. | [Example](https://consensys.github.io/smart-contract-best-practices/recommendations/#mark-untrusted-contracts)
| **4.9** | [ ] | [ ] | Verify all state changes occur **before** external calls.  | Use [Check-Effects-Interactions](http://solidity.readthedocs.io/en/develop/security-considerations.html?highlight=check%20effects#use-the-checks-effects-interactions-pattern). See: [SWC-107](https://swcregistry.io/docs/SWC-107) and [ReEntrancy](https://consensys.github.io/smart-contract-best-practices/known_attacks/#reentrancy)
| **4.10** | [ ] | [ ] | Verify contracts don't use transfer() or send(). | [Transfer & Send](https://consensys.github.io/smart-contract-best-practices/recommendations/#dont-use-transfer-or-send)
| **4.11** | [ ] | [ ] | Verify all calls handle errors and check return values. | [Errors & Return Values](https://consensys.github.io/smart-contract-best-practices/recommendations/#handle-errors-in-external-calls) and [SWC-104](https://swcregistry.io/docs/SWC-104)
| **4.12** | [ ] | [ ] | Verify external calls favor pull over push. | [Pull over Push](https://consensys.github.io/smart-contract-best-practices/recommendations/#favor-pull-over-push-for-external-calls) and [SWC-128 DoS](https://swcregistry.io/docs/SWC-128)  
| **4.13** | [ ] | [ ] | Verify Delegate execution is only to trusted contracts, and never to a user supplied address. | [Delegate to untrusted code](https://consensys.github.io/smart-contract-best-practices/recommendations/#dont-delegatecall-to-untrusted-code) and [SWC-112](https://swcregistry.io/docs/SWC-112)  
| **4.14** | [ ] | [ ] | Verify contracts never use strict equality checks for Ether balance. Contracts should still function with an unexpected either balance. | [SWC-132](https://swcregistry.io/docs/SWC-132) and [Forcible Ether Send](https://consensys.github.io/smart-contract-best-practices/recommendations/#remember-that-ether-can-be-forcibly-sent-to-an-account)
| **4.15** | [ ] | [ ] | Verify functions and contracts don't assume any on-chain data is private.  | [Best Practices](https://consensys.github.io/smart-contract-best-practices/recommendations/#remember-that-on-chain-data-is-public)
| **4.16** | [ ] | [ ] | Beware some participants may "drop offline" and not return.  | [Best Practices](https://consensys.github.io/smart-contract-best-practices/recommendations/#beware-of-the-possibility-that-some-participants-may-drop-offline-and-not-return)
| **4.17** | [ ] | [ ] | Beware of negation of the most negative signed integer. | [Best Practices](https://consensys.github.io/smart-contract-best-practices/recommendations/#beware-of-negation-of-the-most-negative-signed-integer)

# V5: Arithmetic

## Control Objective

Ensure that a verified contract satisfies the following high-level requirements:

- All mathematical operations and extreme variable values are handled in a safe and predictable manner.

Category “V5” lists requirements related to the arithmetic operations of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **5.1** | [ ] | [ ] | Verify that the values and math operations are resistant to integer overflows. Use SafeMath library for arithmetic operations. |  Links
| **5.2** | [ ] | [ ] | Verify that the extreme values (e.g. maximum and minimum values of the variable type) are considered and does change the logic flow of the contract. |  Links
| **5.3** | [ ] | [ ] | Verify that non-strict inequality is used for balance equality. |  Links

## References

For more information, see also:

- [DASP 10: Artithmetic Issues](https://www.dasp.co/#item-3)
- [OpenZeppelin: SafeMath](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)
- [SWC-101 Integer Overflow and Underflow](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-101)

# V6: Malicious input handling

## Control Objective

Values obtained as parameters by smart contracts should be validated.

Ensure that a verified contract satisfies the following high-level requirements:

- The function parameters being passed are handled in a safe and predictable manner.

Category “V6” lists requirements related to the malicious input to the functions of smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **6.1** | [ ] | [ ] | Verify that if the input (function parameters) is validated, the positive validation approach (whitelisting) is used. |  Links
| **6.2** | [ ] | [ ] | Verify that the length of the address being passed is determined and validated by smart contract. |  Links

## References

For more information, see also:

- [Security Considerations - Sending and Receiving Ether](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#sending-and-receiving-ether)
- [OpenZeppelin: SafeMath](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)

# V7: Gas usage & limitations

## Control Objective

The efficiency of gas consumption should be taken into account not only in terms of optimization, but also in terms of safety to avoid possible exhaustion. Smart contracts by nature have different limitations that, if they are not taken into account, can cause different vulnerabilities.

Ensure that a verified contract satisfies the following high-level requirements:

- The use of gas is optimized and unnecessary losses are prevented,
- The implementation is in line with the smart contracts' limitations.

Category “V7” lists requirements related to gas and smart contract limitations.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **7.1** | [ ] | [ ] | Verify that the usage of gas in the smart contract is anticipated, defined and has clear limitations that cannot be exceeded. Both, code structure and malicious input should not cause gas exhaustion. |  Links
| **7.2** | [ ] | [ ] | Verify that two types of the addresses are considered when using the send function. Sending Ether to the contract address costs more than sending Ether to the personal address. |  Links
| **7.3** | [ ] | [ ] | Verify that the contract does not iterate over unbound loops. |  Links
| **7.4** | [ ] | [ ] | Verify that the contract does not check whether the address is a contract using *extcodesize* opcode. |  Links
| **7.5** | [ ] | [ ] | Verify that the contract does not generate pseudorandom numbers trivially basing on the information from blockchain (e.g. seeding with the block number). |  Links
| **7.6** | [ ] | [ ] | Verify that the contract does not assume fixed-point precision but uses a multiplier or store both the numerator and denominator instead. |  Links
| **7.7** | [ ] | [ ] | Verify that, if signed transactions are used for relaying, the signatures are created in the same way for every possible flow to prevent replay attacks. |  Links
| **7.8** | [ ] | [ ] | Verify that there exists a mechanism that protects the contract from a replay attack in case of a hard-fork. |  Links
| **7.9** | [ ] | [ ] | Verify that all library functions that should be upgradeable are not internal. |  Links
| **7.10** | [ ] | [ ] | Verify that the *external* keyword is used for functions that can be called externally only to save gas. |  Links
| **7.11** | [ ] | [ ] | Verify that there is no hard-coded amount of gas assigned to the function call (the gas prices may vary in the future). |  Links

## References

For more information, see also:

- [DASP 10: Bad Randomness](https://www.dasp.co/#item-6)
- [Gas Limit and Loops](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#gas-limit-and-loops)
- [Insufficient gas griefing](https://consensys.github.io/smart-contract-best-practices/known_attacks/#insufficient-gas-griefing)
- [SWC-121 Missing Protection against Signature Replay Attacks](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-121)
- [EIP 150: Gas cost changes for IO-heavy operations](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md)
- [EIP 1344: ChainID opcode](https://eips.ethereum.org/EIPS/eip-1344)

# V8: Business logic

## Control Objective

To build secure smart contracts, we need to consider security of their business logic. Some of the smart contracts are influenced by vulnerabilities by their design.
The components used should not be considered safe without verification. Business assumptions should meet with the principle of minimal trust, which is essential in building smart contracts.

Ensure that a verified contract satisfies the following high-level requirements:

- The business logic flow is sequential and in order.
- Business limits are specified and enforced.
- Cryptocurrency and token business logic flows have considered abuse cases and malicious actors.

Category “V8” lists requirements related to the business logic of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **8.1** | [ ] | [ ] | Verify  the contract logic implementation corresponds to the documentation. |  Links
| **8.2** | [ ] | [ ] | Verify that the business logic flows of smart contracts proceed in a sequential step order and it is not possible to skip any part of it or to do it in a different order than designed.  |  Links
| **8.3** | [ ] | [ ] | Verify that the contract has business limits and correctly enforces it. |  Links
| **8.4** | [ ] | [ ] | Verify that the business logic of contract does not rely on the values retrieved from untrusted contracts with multiple calls of the same function. |  Links
| **8.5** | [ ] | [ ] | Verify that the contract logic does not rely on the balance of contract (e.g. balance == 0). |  Links
| **8.6** | [ ] | [ ] | Verify that the sensitive operations of contract do not depend on the block data (i.e. block hash, timestamp). |  Links
| **8.7** | [ ] | [ ] | Verify that the contract uses mechanisms that mitigate transaction-ordering dependence (front-running) attacks (e.g. pre-commit scheme). |  Links
| **8.8** | [ ] | [ ] | Verify that the contract does not send funds automatically but it lets users withdraw funds on their own in separate transaction instead. |  Links
| **8.9** | [ ] | [ ] | Verify that the inherited contracts do not contain identical functions or the order of inheritance is carefully specified. |  Links
| **8.10** | [ ] | [ ] | Verify that the business logic does not compare the extcodehash return value with 0 to check whether another address is contract (the hash of empty data is returned in such case). |  Links

## References

For more information, see also:

- [Timestamp Dependence](https://consensys.github.io/smart-contract-best-practices/recommendations/#timestamp-dependence)
- [DASP 10: Front-Running](https://www.dasp.co/#item-7)
- [Front-Running (AKA Transaction-Ordering Dependence)](https://consensys.github.io/smart-contract-best-practices/known_attacks/)
- [Solidity Recommendations](https://consensys.github.io/smart-contract-best-practices/recommendations/)
- [SWC-125 Incorrect Inheritance Order](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-125)
- [EIP 1052: EXTCODEHASH Opcode](https://eips.ethereum.org/EIPS/eip-1052)

# V9: Denial of service

## Control Objective

Ensure that a verified contract satisfies the following high-level requirements:

- The contract logic prevents influencing the availability of the contract.

Category “V9” lists requirements related to the possible denial of service of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **9.1** | [ ] | [ ] | Verify the self-destruct functionality is used only if necessary. |  Links
| **9.2** | [ ] | [ ] | Verify the business logic does not block its flows when any of the participants is absent forever.  |  Links
| **9.3** | [ ] | [ ] | Verify the contract logic does not disincentivize users to use contracts (e.g. the cost of transaction is higher that the profit). |  Links
| **9.4** | [ ] | [ ] | Verify the expressions of functions assert or require to have a passing variant. |  Links
| **9.5** | [ ] | [ ] | Verify if the fallback function is not callable by anyone, it is not blocking the functionalities of contract and the contract is not vulnerable to Denial of Service attacks. |  Links
| **9.6** | [ ] | [ ] | Verify the function calls to external contracts (e.g. *send*, *call*) are not the arguments of *require* and *assert* functions. |  Links
| **9.7** | [ ] | [ ] | Verify the function declarations are callable by the used compiler version (see the *Uncallable function example* link below). |  Links

## References

For more information, see also:

- [DASP 10: Denial of Service](https://www.dasp.co/#item-5)
- [Gas Limit and Loops](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#gas-limit-and-loops)
- [Gas Limit DoS on the Network via Block Stuffing](https://consensys.github.io/smart-contract-best-practices/known_attacks/#gas-limit-dos-on-the-network-via-block-stuffing)
- [DoS with Block Gas Limit](https://consensys.github.io/smart-contract-best-practices/known_attacks/#dos-with-block-gas-limit)
- [SWC-128 DoS With Block Gas Limit](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-128)
- [SWC-113 DoS with Failed Call](https://smartcontractsecurity.github.io/SWC-registry/docs/SWC-113)
- [Uncallable function example](https://github.com/ethereum/EIPs/issues/820#issuecomment-454021564)

# V10: Token

## Control Objective

Ensure that a verified contract satisfies the following high-level requirements:

- The implemented token follows the security standards.

Category “V10” lists requirements related to the token of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **10.1** | [ ] | [ ] | Verify that the token contract follows a tested and stable token standard. |  Links
| **10.2** |  [ ] | [ ] | Use the approved function of the ERC-20 standard to change allowed amount only to 0 or from 0.  | Links
| **10.3** | [ ] | [ ] | Verify that the contract does not allow to transfer tokens to zero address. |  Links
| **10.4** | [ ] | [ ] | Verify that the re-entracy attack has been considered when using the token contracts with callbacks (e.g. ERC-777). |  Links
| **10.5** | [ ] | [ ] | Verify that the transfer business logic is consistent, especially when re-sending tokens to the same address (msg.sender == destination). |  Links
| **10.6** | [ ] | [ ] | Verify that the transfer() and transferFrom() return a boolean. Several tokens do not return a boolean on these functions. As a result, their calls in the contract might fail. |  Links
| **10.7** | [ ] | [ ] | Verify that the name, decimals, and symbol functions are present if used. These functions are optional in the ERC20 standard and might not be present.|  Links
| **10.8** | [ ] | [ ] | Verify that decimals returns a uint8. Several tokens incorrectly return a uint256. If this is the case, ensure the value returned is below 255. |  Links
| **10.9** | [ ] | [ ] | Verify that the token mitigates the known [ERC20 race condition](https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729). The ERC20 standard has a known ERC20 race condition that must be mitigated to prevent attackers from stealing tokens. |  Links
| **10.10** | [ ] | [ ] | Verify that the token is not an ERC777 token and has no external function call in transfer and transferFrom. External calls in the transfer functions can lead to reentrancies. |  Links
| **10.11** | [ ] | [ ] | Verify the [ERC conformance](https://github.com/crytic/slither/wiki/ERC-Conformance) of ERC20, ERC223, ERC777, ERC721, ERC165, ERC1820 with ```slither-check-erc```|  Links

## References

For more information, see also:

- [Token Implementation Best Practice](https://consensys.github.io/smart-contract-best-practices/tokens/)
- [iToken Duplication Incident Report](https://bzx.network/blog/incident)

# V11: Code clarity

## Control Objective

Ensure that a verified contract satisfies the following high-level requirements:

- The code is clear and easy to read,
- There are no unwanted or unused parts of the code,
- Variable names are in line with good practices,
- The functions being used are secure.

Category “V11” lists requirements related to the code clarity of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **11.1** | [ ] | [ ] | Verify that the logic is clear and modularized in multiple simple contracts and functions. |  Links
| **11.2** | [ ] | [ ] | Verify that the inheritance order is considered for contracts that use multiple inheritance and shadow functions.  |  Links
| **11.3** | [ ] | [ ] | Verify that the contract uses existing and tested code (e.g. token contract or mechanisms like *ownable*) instead of implementing its own. |  Links
| **11.4** | [ ] | [ ] | Verify that the same rules for variable naming are followed throughout all the contracts (e.g. use the same variable name for the same object). |  Links
| **11.5** | [ ] | [ ] | Verify that variables with similar names are not used. |  Links
| **11.6** | [ ] | [ ] | Verify that all variables are defined as storage or memory variable. |  Links
| **11.7** | [ ] | [ ] | Verify that all storage variables are initialised. |  Links
| **11.8** | [ ] | [ ] | Verify that the constructor keyword is used for Solidity version greater than 0.4.24. For older versions of Solidity make sure the constructor name is the same as contract's name. |  Links
| **11.9** | [ ] | [ ] | Verify that the functions which specify a return type return the value. |  Links
| **11.10** | [ ] | [ ] | Verify that all functions are used. Unused ones should be removed. |  Links
| **11.11** | [ ] | [ ] | Verify that the *require* function is used instead of the *revert* function in *if* statement. |  Links
| **11.12** | [ ] | [ ] | Verify that the *assert* function is used to test for internal errors and the *require* function is used to ensure a valid condition on the input from users and external contracts. |  Links
| **11.13** | [ ] | [ ] | Verify that assembly code is used only if necessary. |  Links

## References

For more information, see also:

- [Solidity: Security Considerations & Recommendations](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#recommendations)

# V12: Test coverage

## Control Objective

Ensure that a verified contract satisfies the following high-level requirements:

- The specification has been formally tested,
- The implementation has been tested statically and dynamically,
- The implementation has been tested using symbolic execution.

Category “V12” lists requirements related to the testing process of the smart contracts.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **12.1** | [ ] | [ ] | Verify that all functions of verified contract are covered with tests in the development phase. |  Links
| **12.2** | [ ] | [ ] | Verify that the implementation of verified contract has been checked for security vulnerabilities using static and dynamic analysis. |  Links
| **12.3** | [ ] | [ ] | Verify that the specification of smart contract has been formally verified.  |  Links
| **12.4** | [ ] | [ ] | Verify that the specification and the result of formal verification is included in the documentation.  |  Links

## References

For more information, see also:

- [Formal Verification](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html#formal-verification)
- [Code coverage for Solidity testing](https://github.com/sc-forks/solidity-coverage)
- [Remix IDE](https://remix.ethereum.org/)
- [MythX Plugin for Truffle](https://github.com/ConsenSys/truffle-security)
- [Securify](https://securify.chainsecurity.com/)
- [SmartCheck](https://tool.smartdec.net/)
- [Oyente](https://github.com/melonproject/oyente)
- [Security Tools](https://consensys.github.io/smart-contract-best-practices/security_tools/)

# V13: Known attacks

## Control Objective

The _Known attacks_ category has a different form from the other categories. It covers all known attacks and link them to the requirements from other categories.

Category “V13” aims to ensure that a verified contract is protected from the known attacks.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **13.1** | [ ] | [ ] | Verify that the contract is not vulnerable to Integer Overflow and Underflow attacks.  Links
|     | [ ] | [ ] | Verify that the values and math operations are resistant to integer overflows. Use SafeMath library for arithmetic operations. |  Links
|     |[ ] | [ ] |Verify that the extreme values (e.g. maximum and minimum values of the variable type) are considered and does change the logic flow of the contract. |  Links
| **13.2** | [ ] | [ ] | Verify that the contract is not vulnerable to Reentrancy attack.  Links
|     | [ ] | [ ] | Verify that the re-entrancy attack is mitigated by blocking recursive calls from the other contracts. Do not use *call* and *send* functions unless it is a must. |  Links
| **13.3** | [ ] | [ ] | Verify that the contract is not vulnerable to Access Control issues.  Links
|     | [ ] | [ ] | Verify that the principle of least privilege exists - other contracts should only be able to access functions or data for which they possess specific authorization. |  Links
|     | [ ] | [ ] | Verify that new contracts with access to the audited contract adhere to the principle of minimum rights by default. Contracts should have a minimal or no permission until access to the new features is explicitly granted. |  Links
|     | [ ] | [ ] | Verify that the creator of the contract complies with the rule of least privilege and his rights strictly follow the documentation. |  Links
|     | [ ] | [ ] | Verify that the contract enforces the access control rules specified in a trusted contract, especially if the dApp client-side access control is present (as the client-side access control can be easily bypassed). |  Links
|     | [ ] | [ ] | Verify that there is a centralized mechanism for protecting access to each type of protected resource. |  Links
|     | [ ] | [ ] | Verify that the calls to external contracts are allowed only if necessary. |  Links
|     | [ ] | [ ] | Verify that visibility of all functions is specified. |  Links
|     |[ ] | [ ] | Verify that the initialization functions are marked internal and cannot be executed twice. |  Links
|     | [ ] | [ ] | Verify that the code of modifiers is clear and simple. The logic should not contain external calls to untrusted contracts. |  Links
|     |  [ ] | [ ] | Verify that the contract relies on the data provided by right sender and contract does not rely on *tx.origin* value. |  Links
|     |  [ ] | [ ] | Verify that all user and data attributes used by access controls are kept in trusted contract and cannot be manipulated by other contracts unless specifically authorized. |  Links
|     |  [ ] | [ ] |Verify that the access controls fail securely including when a revert occurs. |  Links
|     | [ ] | [ ] | Verify that there is a component that monitors access to sensitive contract data using events. |  Links
|     | [ ] | [ ] | Verify that the contract does not check whether the address is a contract using extcodesize opcode. |  Links
| **13.4** | [ ] | [ ] | Verify that the contract is not vulnerable to Silent Failing Sends and Unchecked-Send attacks.  Links
|     | [ ] | [ ] | Verify that the result of low-level function calls (e.g. *send*, *delegatecall*, *call*) from another contracts is checked. |  Links
|     | [ ] | [ ] | Verify that the third party contracts do not shadow special functions (e.g. *revert*). |  Links
| **13.5** | [ ] | [ ] | Verify that the contract is not vulnerable to Denial of Service attacks.  Links
|     | [ ] | [ ] | Verify that the contract does not iterate over unbound loops. |  Links
|     | [ ] | [ ] | Verify that the self-destruct functionality is used only if necessary. |  Links
|     | [ ] | [ ] | Verify that the business logic does not block its flows when any of the participants is absent forever. |  Links
|     | [ ] | [ ] | Verify that the contract logic does not disincentivize users to use contracts (e.g. the cost of transaction is higher that the profit). |  Links
|     | [ ] | [ ] | Verify that the expressions of functions assert or require have a passing variant. |  Links
|     | [ ] | [ ] | Verify that if the fallback function is not callable by anyone, it is not blocking the functionalities of contract and the contract is not vulnerable to Denial of Service attacks. |  Links
|     | [ ] | [ ] | Verify that the function calls to external contracts (e.g. send, call) are not the arguments of require and assert functions. |  Links
| **13.6** | [ ] | [ ] | Verify that the contract is not vulnerable to Bad Randomness issues.  Links
|     | [ ] | [ ] | Verify that the contract does not generate pseudorandom numbers trivially basing on the information from blockchain (e.g. seeding with the block number). |  Links
| **13.7** | [ ] | [ ] | Verify that the contract is not vulnerable to Front-Running attacks.  Links
|     | [ ] | [ ] | Verify that the contract uses mechanisms that mitigate transaction-ordering dependence (front-running) attacks (e.g. pre-commit scheme). |  Links
| **13.8** | [ ] | [ ] | Verify that the contract is not vulnerable to Time Manipulation issues.  Links
|     | [ ] | [ ] | Verify that the sensitive operations of contract do not depend on the block data (i.e. block hash, timestamp). |  Links
| **13.9** | [ ] | [ ] | Verify that the contract is not vulnerable to Short Address Attack.  Links
|     | [ ] | [ ] |Verify that the length of passed address is determined and validated by smart contract. |  Links
| **13.10** | [ ] | [ ] | Verify that the contract is not vulnerable to Insufficient Gas Griefing attack.  Links
|     | [ ] | [ ] | Verify that the usage of gas in smart contracts is anticipated, defined and have clear limitations that cannot be exceeded. Both, code structure and malicious input should not cause gas exhaustion. |  Links
|     | [ ] | [ ] | Verify that two types of the addresses are considered when using the send function. Sending Ether to contract address costs more than sending Ether to personal address. |  Links
|     | [ ] | [ ] | Verify that the contract does not iterate over unbound loops. |  Links
|     | [ ] | [ ] | Verify that the contract does not check whether the address is a contract using *extcodesize* opcode. |  Links
|     | [ ] | [ ] | Verify that the external keyword is used for functions that can be called externally only to save gas. |  Links

## References

For more information, see also:

- [DASP - Top 10](https://dasp.co/)
- [Known Attacks](https://consensys.github.io/smart-contract-best-practices/known_attacks/)

# V14: Decentralized Finance

## Control Objective

The Decentralized Finance (DeFi) is a concept with various financial applications deployed on blockchain using smart contracts. This category covers the security requirements for the constructions used by the DeFi applications such as lending pools, flash loans, governance, on-chain oracles, etc.

Ensure that a verified contract satisfies the following high-level requirements:

- The assets controlled by decentralized finance are safe and cannot be withdrawed by an unauthorized person.
- The data sources for decentralized finance (e.g. oracles) cannot be manipulated.

Category “V14” lists requirements related to the contructions used by the decentralized finance solutions.

## Security Verification Requirements

| # | Rating | Severity | Description | Resources
| --- | --- | --- | --- | -- |
| **14.1** | [ ] | [ ] | Verify that the lender's contract does not assume its balance (used to confirm loan repayment) to be changed only with its own functions.  Links
| **14.2** | [ ] | [ ] | Verify that the functions which change lender's balance and lend cryptocurrency are non-re-entrant if the smart contract allows to borrow the main platform's cryptocurrency (e.g. Ethereum). It blocks the attacks that update the borrower's balance during the flash loan execution. |  Links
| **14.3** | [ ] | [ ] | Verify that the flash loan function can call only a predefined function on the receiver contract. If it is possible, define a trusted subset of contracts to be called. Usually, the sender (borrower) contract is the one to be called back. |  Links
| **14.4** | [ ] | [ ] | Verify that the receiver's function that handles borrowed ETH or tokens can be called only by the pool and within a process initiated by the receiver's owner or other trusted source (e.g. multisig), if it includes potentially dangerous operations (e.g. sending back more ETH/tokens than borrowed). |  Links
| **14.5** | [ ] | [ ] | Verify that the calculations of the share in a liquidity pool are performed with the highest possible precision (e.g. if the contribution is calculated for ETH it should be done with 18 decimals precision - for Wei, not Ether). The dividend must be multiplied by the 10 to the power of the number of decimals (e.g. dividend * 10**18 / divisor). |  Links
| **14.6** | [ ] | [ ] | Verify that the rewards cannot be calculated and distributed within the same function call that deposits tokens (it should also be defined as non-re-entrant). That protects from the momentary fluctuations in shares. |  Links
| **14.7** | [ ] | [ ] | Verify that the governance contracts are protected from the attacks that use flash loans. One possible security is to require the process of depositing governance tokens and proposing a change to be executed in different transactions included in different blocks. |  Links
| **14.8** | [ ] | [ ] | Verify that, when using an on-chain oracles, the smart contract is able to pause the operations based on the oracle's result (in case of oracle has been compromised). |  Links
| **14.9** | [ ] | [ ] | Verify that the external contracts (even trusted) that are allowed to change the attributes of the smart contract (e.g. token price) have the following limitations implemented: a thresholds for the change (e.g. no more/less than 5%) and a limit of updates (e.g. one update per day). |  Links
| **14.10** | [ ] | [ ] | Verify that the smart contract attributes that can be updated by the external contracts (even trusted) are monitored (e.g. using events) and the procedure of incident response is implemented (e.g. the response to an ongoing attack). |  Links
| **14.11** | [ ] | [ ] | Verify that the complex math operations that consist of both multiplication and division operations firstly perform the multiplications and then division. |  Links
| **14.12** | [ ] | [ ] | Verify that, when calculating conversion price (e.g. price in ETH for selling a token), the numerator and denominator are multiplied by the reserves (see the *getInputPrice* function in *UniswapExchange* contract as an example). |  Links

## References

For more information, see also:

- [Damn Vulnerable #DeFi](https://damnvulnerabledefi.xyz)
- [Damn vulnerable #DeFi Write-ups & lessons learned](https://drdr-zz.medium.com/write-ups-and-lessons-learned-from-damn-vulnerable-defi-caa95d2678ec)
- [Damn Vulnerable Defi Github with Writeups](https://github.com/damianrusinek/damn-vulnerable-defi)
- [Uniswap's getInputPrice function](https://github.com/Uniswap/uniswap-v1/blob/master/contracts/uniswap_exchange.vy#L106)

# Acknowledgements

## Contributors

We would like to thank aftermentioned people for the initial feedback on SCSVS:

- Gabriel Garrido Calvo (Lightstreams Network)
- Bernhard Mueller (ConsenSys)
- Tomasz Szymański (SoftwareMill)

## Community

We would like to thank the creators of the following websites, which are a great source of information about the security of smart contracts:

- [Decentralized Application Security Project Top 10](https://dasp.co/)
- [Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Smart Contract Weakness Classification and Test Cases](https://smartcontractsecurity.github.io/SWC-registry/)
- [Solidity - Security Considerations](https://solidity.readthedocs.io/en/v0.5.10/security-considerations.html)
