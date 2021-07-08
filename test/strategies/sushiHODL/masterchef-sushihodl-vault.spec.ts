import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT,
         VAULT_ADDRESS_USDC_USDT,
         STRATEGY_OWNER,
         MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT,
         USDC_ADDRESS, USDC_WHALE_ADDRESS,
          USDT_ADDRESS, USDT_WHALE_ADDRESS,
           SUSHISWAP_V2_ROUTER02_ADDRESS } 
         from "../../polygon-mainnet-fork-test-config";
import { Logger } from "tslog";
const logger: Logger = new Logger();

const vaultBehaviour = (underlyingAddress : string, ) => {
    
    let underlyingInstance : any;
    let user : any;
    let signer : any;
    let vaultInstance : any;
    let strategyInstance : any;
    let routerInstance: any;
    let strategyOwnerSigner: any;
    let lpBalance: number;

    
describe("MasterChef V2 - SushiHODL Vault mainnet fork Tests", function () {

    
    before(async function () {
        [user] = await ethers.getSigners();

        console.log(`impersonating STRATEGY_OWNER`);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [STRATEGY_OWNER]}
        );

        console.log(`impersonated STRATEGY_OWNER`);

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT]}
        );

        console.log(`impersonated SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT`);

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE_ADDRESS]}
        );

        const usdcWhaleSigner = await ethers.provider.getSigner(USDC_WHALE_ADDRESS);
        expect(usdcWhaleSigner).to.not.be.null; 
    

        console.log(`impersonated USDC_WHALE_ADDRESS`);


        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDT_WHALE_ADDRESS]}
        );

        const usdtWhaleSigner = await ethers.provider.getSigner(USDT_WHALE_ADDRESS);
        expect(usdtWhaleSigner).to.not.be.null;

        strategyOwnerSigner = await ethers.provider.getSigner(STRATEGY_OWNER);
        expect(strategyOwnerSigner).to.not.be.null; 
    
        console.log(`impersonated USDT_WHALE_ADDRESS`);
        
        const usdcInstance = await ethers.getContractAt("IERC20", USDC_ADDRESS);
       await usdcInstance.connect(usdcWhaleSigner).approve(STRATEGY_OWNER, 100);
        console.log(`approved usdc spending`);

        const usdcAllowance = await usdcInstance.connect(usdcWhaleSigner).allowance(USDC_WHALE_ADDRESS,STRATEGY_OWNER);
        console.log(`usdcAllowance is: ${usdcAllowance}`);

        console.log(`transfering usdc spending`);
        await usdcInstance.connect(usdcWhaleSigner).transfer(STRATEGY_OWNER,usdcAllowance);
        console.log(`transfered usdc spending`);

        const usdtInstance = await ethers.getContractAt("IERC20", USDT_ADDRESS);
        await usdtInstance.connect(usdtWhaleSigner).approve(STRATEGY_OWNER, 100);
        const usdtAllowance = await usdtInstance.connect(usdtWhaleSigner).allowance(USDT_WHALE_ADDRESS, STRATEGY_OWNER);

        console.log(`transfering usdt spending`);
        await usdtInstance.connect(usdtWhaleSigner).transfer(STRATEGY_OWNER, usdtAllowance);
        console.log(`transfered usdt spending`);


        await usdcInstance.connect(strategyOwnerSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, usdcAllowance);    
        console.log(`approved usdc spending for UniswapRouter`);
        const usdcAllowanceForRouter = await usdcInstance.connect(strategyOwnerSigner).allowance(STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS);
        console.log(`USDC allowance for router is: ${usdcAllowanceForRouter}`);

        await usdtInstance.connect(strategyOwnerSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, usdtAllowance);    
        console.log(`approved usdt spending for UniswapRouter`);
        const usdtAllowanceForRouter = await usdtInstance.connect(strategyOwnerSigner).allowance(STRATEGY_OWNER, SUSHISWAP_V2_ROUTER02_ADDRESS);
        console.log(`USDT allowance for router is: ${usdtAllowanceForRouter}`);

        underlyingInstance = await ethers.getContractAt("IERC20", SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT);   

        lpBalance = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lpBalance before AddLiquidity: ${lpBalance}`);

        routerInstance = await ethers.getContractAt("IUniswapV2Router02", SUSHISWAP_V2_ROUTER02_ADDRESS);
        console.log(`calling add-liquidity to SUSHISWAP_V2_ROUTER02_ADDRESS: ${SUSHISWAP_V2_ROUTER02_ADDRESS}`);
        await routerInstance.connect(strategyOwnerSigner).addLiquidity(USDC_ADDRESS,USDT_ADDRESS, 10, 10, 0, 0, STRATEGY_OWNER, 1925582791);
        console.log(`added USDC-USDT liquidity to SUSHISWAP_V2_ROUTER02_ADDRESS: ${SUSHISWAP_V2_ROUTER02_ADDRESS}`);

        
        lpBalance = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lpBalance After AddLiquidity: ${lpBalance}`);

        strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
        expect(strategyInstance).to.not.be.null;
        vaultInstance = await ethers.getContractAt("Vault", VAULT_ADDRESS_USDC_USDT);
        expect(vaultInstance).to.not.be.null;

        const currentWithdrawFee = await vaultInstance.withdrawFee();
        console.log(`currentWithdrawFee from Vault: ${currentWithdrawFee}`);
        
        const setWithdrawFeeTxn = await vaultInstance.connect(strategyOwnerSigner).setWithdrawFee(10);
        await setWithdrawFeeTxn.wait();

        const withdrawFee = await vaultInstance.withdrawFee();
        console.log(`withdrawFee from Vault: ${withdrawFee}`);

        const decimals = await vaultInstance.decimals();
        console.log(`decimals from Vault: ${decimals}`);

        const underlyingBalanceWithInvestment = await vaultInstance.underlyingBalanceWithInvestment();
        console.log(`underlyingBalanceWithInvestment from Vault: ${underlyingBalanceWithInvestment}`);

        const totalSupply = await vaultInstance.totalSupply();
        console.log(`totalSupply from Vault: ${totalSupply}`);
        
        const pricePerFullShare = await vaultInstance.getPricePerFullShare();
        console.log(`pricePerFullShare from Vault: ${pricePerFullShare}`);

    });

    describe("deposit and doHardWork", async () => {
 

      // then fast forward 1 week
      // then: 
      it("should compound rewards after 1 week", async () => {

            // approve LP Spending for Vault, 
            // deposit into vault,
            // vault deposits into strategy
            // strategy deposits into MiniChef

        //approve for Vault
        
        console.log(`approving lpAllowanceForVault: ${VAULT_ADDRESS_USDC_USDT}`);
        await underlyingInstance.connect(strategyOwnerSigner).approve(VAULT_ADDRESS_USDC_USDT, lpBalance);
        //await underlyingInstance.connect(strategyOwnerSigner).approve(VAULT_ADDRESS_USDC_USDT, lpBalance);
        console.log(`approved lpAllowanceForVault: ${VAULT_ADDRESS_USDC_USDT}`);

        const lpAllowanceForVault = await underlyingInstance.connect(strategyOwnerSigner).allowance(STRATEGY_OWNER, VAULT_ADDRESS_USDC_USDT);
        console.log(`lpAllowanceForVault is: ${lpAllowanceForVault}`);

        //approve vault sample transaction
        //https://polygonscan.com/tx/0x1a75ff5f5fa046bb3ca71acf2a1ed2406ec03942c2b5528f3881540ce482734a
    
        //USDC-USDT pair
        //https://polygonscan.com/address/0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001


        //deposit To Vault

        //deposit To vault sample transaction
        // https://polygonscan.com/tx/0x981cb7912d3dc3d0c7dd5894e1bda738423d237c33768e0a9126e68689ff29fb

        const lpBalanceOfDepositorBeforeDeposit : number = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lpBalanceOfDepositorBeforeDeposit: ${lpBalanceOfDepositorBeforeDeposit}`);
        expect(lpBalanceOfDepositorBeforeDeposit).to.be.equal(lpBalance);


        const lpBalanceInVaultBeforeDeposit : number  = await underlyingInstance.balanceOf(VAULT_ADDRESS_USDC_USDT);
        console.log(`lpBalanceInVaultBeforeDeposit: ${lpBalanceInVaultBeforeDeposit}`);

        const VaultDeposittxResponse : any  = await vaultInstance.connect(strategyOwnerSigner).deposit(lpBalance);
        await VaultDeposittxResponse.wait();

        const lpBalanceAfterDeposit : number  = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lp-Balance of Depositor After Deposit: ${lpBalanceAfterDeposit}`);
        expect(lpBalanceAfterDeposit).to.be.equal(0);

        const lpBalanceInVaultAfterDeposit : number  = await underlyingInstance.balanceOf(VAULT_ADDRESS_USDC_USDT);
        console.log(`lp-Balance In Vault After Deposit: ${lpBalanceInVaultAfterDeposit}`);

        const expectedVaultBalanceAfterDeposit : number = Number(lpBalanceOfDepositorBeforeDeposit) + Number(lpBalanceInVaultBeforeDeposit);
        console.log(`expectedVaultBalanceAfterDeposit: ${expectedVaultBalanceAfterDeposit}`);

        expect(lpBalanceInVaultAfterDeposit).to.be.equal(expectedVaultBalanceAfterDeposit);

        const xlpBalanceAfterDeposit = await vaultInstance.balanceOf(STRATEGY_OWNER);
        console.log(`xlp-Balance After Deposit is: ${xlpBalanceAfterDeposit}`);  

         const hardWorkTxResponse = await vaultInstance.connect(strategyOwnerSigner).doHardWork();
         await hardWorkTxResponse.wait();
         console.log(`hardWorkTxResponse is: ${JSON.stringify(hardWorkTxResponse)}`);  

        const lpBalanceInVaultAfterFirstHardWork = await underlyingInstance.balanceOf(VAULT_ADDRESS_USDC_USDT);
        console.log(`lpBalanceInVaultAfterFirstHardWork: ${lpBalanceInVaultAfterFirstHardWork}`);
        expect(lpBalanceInVaultAfterFirstHardWork).to.be.equal(0);

         let xlpBalanceAfterHardwork = await vaultInstance.balanceOf(STRATEGY_OWNER);
         console.log(`xlpBalance_Before_TimeAdvance_Hardwork is: ${xlpBalanceAfterHardwork}`);  

        await ethers.provider.send("evm_increaseTime", [3600 * 24 * 10]);
        //await ethers.provider.send("evm_mine", []);

        const hardWorkTxResponse2 = await vaultInstance.connect(strategyOwnerSigner).doHardWork();
        await hardWorkTxResponse2.wait();
        console.log(`hardWorkTxResponse2 is: ${JSON.stringify(hardWorkTxResponse2)}`);  

        const xlpBalanceAfterHardwork1 = await vaultInstance.balanceOf(STRATEGY_OWNER);
        console.log(`xlpBalanceAfter_TimeAdvance_Hardwork is: ${xlpBalanceAfterHardwork1} - ${typeof xlpBalanceAfterHardwork1}`);

        const lpBalanceBeforeWithdraw = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lpBalance Before Withdraw: ${lpBalanceBeforeWithdraw}`);

        let xlpForWithdrawal = Number(xlpBalanceAfterHardwork1)-100;

        const totalSupply = await vaultInstance.totalSupply();
        const withdrawFee = await vaultInstance.withdrawFee();

        console.log(`xlpForWithdrawal: ${xlpForWithdrawal} - totalSupply: ${totalSupply} - withdrawFee: ${withdrawFee}`);

        const withdrawFeeShares = (Number(xlpForWithdrawal)*Number(withdrawFee))/(10 ** 18);
        console.log(`withdrawFeeShares: ${withdrawFeeShares}`);

        const numberOfSharesPostFee = Number(xlpForWithdrawal) - Number(withdrawFeeShares);
        console.log(`numberOfSharesPostFee: ${numberOfSharesPostFee}`);

        const calculatedSharePrice  = await vaultInstance.getPricePerFullShare();
        const underlyingUnit = await vaultInstance.underlyingUnit();
        console.log(`underlyingUnit: ${underlyingUnit}`);
        const underlyingAmountToWithdraw = (Number(numberOfSharesPostFee) * Number(calculatedSharePrice))/underlyingUnit;
        console.log(`underlyingAmountToWithdraw: ${underlyingAmountToWithdraw}`);

        let underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
        console.log(`underlyingBalanceInVault: ${underlyingBalanceInVault}`);

        const lpBalanceOfStrategyBeforeWithdraw = await underlyingInstance.balanceOf(MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT);
        console.log(`lpBalance Of Strategy Before Withdraw: ${lpBalanceOfStrategyBeforeWithdraw}`);

        console.log(`about to withdraw: ${xlpForWithdrawal} from strategy to vault: ${VAULT_ADDRESS_USDC_USDT}`);

        const withdrawAllFromVaultTxn = await vaultInstance.connect(strategyOwnerSigner).withdrawAll();
        await withdrawAllFromVaultTxn.wait();

        underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
        console.log(`underlyingBalanceInVault After withdrawAll: ${underlyingBalanceInVault}`);

        //74616502
        const withdrawTxnResponse = await vaultInstance.connect(strategyOwnerSigner).withdraw(xlpBalanceAfterHardwork1);
        await withdrawTxnResponse.wait();
        console.log(`withdrawTxnResponse is: ${JSON.stringify(withdrawTxnResponse)}`);  

        const lpBalanceAfterWithdraw = await underlyingInstance.balanceOf(STRATEGY_OWNER);
        console.log(`lpBalance After Withdraw: ${lpBalanceAfterWithdraw}`);
        expect(Number(lpBalanceAfterWithdraw)).to.be.gt(Number(lpBalanceBeforeWithdraw));
      });

    });

  });
}

