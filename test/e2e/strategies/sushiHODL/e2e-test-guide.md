# End to End Test Behavior and Steps:

## SushiHODLStrategy Tests:

### Test Behaviour:

- AddLiquidity to Pool and receive the LP Tokens
    - Assert for LP token Balance 
- Approve Spending
- Do deposit to vault
- Do hardwork
- advance time (1 week)
- Do hardwork
      
- Assertion of Test Output:

    - Assertion for hardwork:

        - events assertion
        - fees sent to controller
        - balance of the investor

    - Withdraw Assertion:
        - Withdrawn Amount should be more than Deposited Amount

    - events assertion
        - able to check the fee percentage
