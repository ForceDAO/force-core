import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import { SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT,
         SUSHISWAP_V2_ROUTER02_ADDRESS,
         USDC_ADDRESS, USDC_WHALE_ADDRESS,
         USDT_ADDRESS, USDT_WHALE_ADDRESS, SUSHI_ADDRESS, WMATIC_ADDRESS, SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0, SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1, SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0, SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1, MINICHEFV2, POOL_ID_USDC_USDT,
       } from "../../../polygon-mainnet-fork-test-config";
import { Logger } from "tslog";
const logger: Logger = new Logger();

describe("MasterChefV2 E2E - mainnet fork Tests", function () {

  let underlyingAddress: string;
  let underlyingInstance: any;  

  let vaultAddress: string;
  let vaultImplementationAddress: string;
  let vaultInstance: any;

  let storageAddress: string;
  let storageInstance: any;

  let strategyFactoryAddress: string;
  let strategyFactoryInstance: any;

  let strategyAddress: string;
  let strategyInstance : any;
  let routerInstance: any;

  let governanceSigner: any;
  let governanceAddress: string;

  let controllerSigner: any;
  let controllerAddress: string;

  let depositor: string;
  let depositorSigner: any;

  let lpBalance: number;
  let totalSupplyCap: number;

  describe("deploy contracts", async () => {
      
      underlyingAddress = SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT;

      logger.info("Deployment log for network: ", network.name);

      // deploy storage
      

      // deploy factory

      // deploy vaultProxy

      // create strategy

  });

  describe("behaviour test", () => {
    before(async () => {

      [governanceSigner, depositorSigner, controllerSigner] = await ethers.getSigners();
      governanceAddress = governanceSigner.address;
      depositor = depositorSigner.address;
      controllerAddress = controllerSigner.address;
      totalSupplyCap= 100089694;
      
      logger.info(`\n--------------- ADDRESS LOGGING --------------\n`)

      logger.info(`governanceAddress is: ${governanceAddress} - depositor is: ${depositor}`);


      logger.info(`\n--------------- CONTRACT DEPLOYMENT STARTED --------------\n`)

      // deploy storage
      const Storage = await ethers.getContractFactory("Storage");
      storageInstance = await Storage.deploy();
      storageAddress = storageInstance.address;
      governanceAddress = await storageInstance.governance.call();
      logger.info(`Storage is deployed @ ${storageAddress} with governanceAddress: ${governanceAddress}`);

      const SushiHodlStrategyFactory = await ethers.getContractFactory("SushiHodlStrategyFactory");
      strategyFactoryInstance = await SushiHodlStrategyFactory.deploy();
      strategyFactoryAddress = strategyFactoryInstance.address;
      logger.info(`SushiHodlStrategyFactory: ${strategyFactoryAddress} is deployed on network: ${network.name}`);
  
      const vaultContract = await ethers.getContractFactory(`contracts/Vault.sol:Vault`);
      vaultInstance = await upgrades.deployProxy(vaultContract, 
          [
            storageAddress,
            underlyingAddress,
            1000,
            1000,
            10
          ],
          {
             initializer: 'initializeVault(address,address,uint256,uint256,uint256)', 
             unsafeAllow: ['constructor'],
             unsafeAllowCustomTypes: true
          });

        vaultAddress = vaultInstance.address;
    
        logger.info(`Deployed Vault @ ${vaultInstance.address}`);
        logger.info(`Initialised Vault: ${vaultInstance.address} on network: ${network.name}`);
        logger.info(`storageAddress: ${storageAddress}`);

        const sushiHodlStrategyCreationTransactionResponse = await strategyFactoryInstance.createSushiHodlStrategy(
          storageAddress,
          underlyingAddress,
          vaultAddress,
          MINICHEFV2,
          POOL_ID_USDC_USDT,
          SUSHISWAP_V2_ROUTER02_ADDRESS,
          SUSHI_ADDRESS,
          WMATIC_ADDRESS,
          SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0,
          SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1,
          SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0,
          SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1
        );

        await sushiHodlStrategyCreationTransactionResponse.wait();
        const strategtTransactionBlockHash = sushiHodlStrategyCreationTransactionResponse.blockHash;

        // get Event Logs of strategy Creation
        const transactionLogs = await ethers.provider.getLogs(strategtTransactionBlockHash);

        // extract strategyAddress from EventLogs
        strategyAddress = transactionLogs[0].topics[1].replace("0x000000000000000000000000", "0x");
        logger.info(`strategyAddress is: ${strategyAddress}`);

        strategyInstance = await ethers.getContractAt(
          "MasterChefHodlStrategy",
          strategyAddress
        );

        logger.info(`\n--------------- CONTRACT DEPLOYMENT ENDED --------------\n`)


        logger.info(`\n--------------- INITIALISATION OF VAULT WITH STRATEGY, TOTALSUPPLYCAP--------------\n`)

        const setStrategyTx = await vaultInstance.setStrategy(strategyAddress);
        await setStrategyTx.wait();
        
        const totalSupplyCapTxnResponse = await vaultInstance.setTotalSupplyCap(totalSupplyCap);
        await totalSupplyCapTxnResponse.wait();

        logger.info(`\n--------------- INITIALISATION OF STORAGE WITH CONTROLLER --------------\n`)

        const setControllerTransaction = await storageInstance.setController(controllerAddress);
        await setControllerTransaction.wait();

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT]}
        );

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE_ADDRESS]}
        );

        const usdcWhaleSigner = await ethers.provider.getSigner(USDC_WHALE_ADDRESS);
        expect(usdcWhaleSigner).to.not.be.null; 

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDT_WHALE_ADDRESS]}
        );

        console.log(`\n--------------- ADD-LIQUIDITY LOGGING --------------\n`)

        const usdtWhaleSigner = await ethers.provider.getSigner(USDT_WHALE_ADDRESS);
        expect(usdtWhaleSigner).to.not.be.null;
          
        const usdcInstance = await ethers.getContractAt("IERC20", USDC_ADDRESS);
        await usdcInstance.connect(usdcWhaleSigner).approve(depositor, 100);
        const usdcAllowance = await usdcInstance.connect(usdcWhaleSigner).allowance(USDC_WHALE_ADDRESS,depositor);
        await usdcInstance.connect(usdcWhaleSigner).transfer(depositor,usdcAllowance);

        const usdtInstance = await ethers.getContractAt("IERC20", USDT_ADDRESS);
        await usdtInstance.connect(usdtWhaleSigner).approve(depositor, 100);
        const usdtAllowance = await usdtInstance.connect(usdtWhaleSigner).allowance(USDT_WHALE_ADDRESS, depositor);

        await usdtInstance.connect(usdtWhaleSigner).transfer(depositor, usdtAllowance);
        await usdcInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, usdcAllowance);    
        const usdcAllowanceForRouter = await usdcInstance.connect(depositorSigner).allowance(depositor, SUSHISWAP_V2_ROUTER02_ADDRESS);
        await usdtInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, usdtAllowance);    
        const usdtAllowanceForRouter = await usdtInstance.connect(depositorSigner).allowance(depositor, SUSHISWAP_V2_ROUTER02_ADDRESS);

        underlyingInstance = await ethers.getContractAt("IERC20", SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT);   

        lpBalance = await underlyingInstance.balanceOf(depositor);
        console.log(`\nSLP-Balance of depositor before AddLiquidity: ${lpBalance}`);

        routerInstance = await ethers.getContractAt("IUniswapV2Router02", SUSHISWAP_V2_ROUTER02_ADDRESS);
        await routerInstance.connect(depositorSigner).addLiquidity(USDC_ADDRESS,USDT_ADDRESS, 10, 10, 0, 0, depositor, 1925582791);

        lpBalance = await underlyingInstance.balanceOf(depositor);
        console.log(`SLP-Balance of Depositor After AddLiquidity: ${lpBalance}\n`);

        console.log(`\n--------------- ADD-LIQUIDITY ENDED --------------\n`)

        strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
        expect(strategyInstance).to.not.be.null;
        vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
        expect(vaultInstance).to.not.be.null;

        const setWithdrawFeeTxn = await vaultInstance.connect(governanceSigner).setWithdrawFee(10);
        await setWithdrawFeeTxn.wait();

        const withdrawFee = await vaultInstance.withdrawFee();
        const decimals = await vaultInstance.decimals();
        const underlyingBalanceWithInvestment = await vaultInstance.underlyingBalanceWithInvestment();
        const totalSupply = await vaultInstance.totalSupply();        
        const pricePerFullShare = await vaultInstance.getPricePerFullShare();
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
        
        await underlyingInstance.connect(depositorSigner).approve(vaultAddress, lpBalance);
        const lpAllowanceForVault = await underlyingInstance.connect(depositorSigner).allowance(depositor, vaultAddress);

        console.log(`\n--------------- BEFORE DEPOSIT --------------\n`)

        const lpBalanceOfDepositorBeforeDeposit : number = await underlyingInstance.balanceOf(depositor);
        console.log(`\nSLP-Balance of Depositor Before Deposit: ${lpBalanceOfDepositorBeforeDeposit}`);
        expect(lpBalanceOfDepositorBeforeDeposit).to.be.equal(lpBalance);

        const lpBalanceInVaultBeforeDeposit : number  = await underlyingInstance.balanceOf(vaultAddress);
        console.log(`SLP-Balance In Vault Before Deposit: ${lpBalanceInVaultBeforeDeposit}`);

        const VaultDeposittxResponse : any  = await vaultInstance.connect(depositorSigner).deposit(lpBalance);
        await VaultDeposittxResponse.wait();
        
        console.log(`\n--------------- AFTER DEPOSIT --------------\n`)

        const lpBalanceAfterDeposit : number  = await underlyingInstance.balanceOf(depositor);
        console.log(`SLP-Balance of Depositor After Deposit: ${lpBalanceAfterDeposit}`);
        expect(lpBalanceAfterDeposit).to.be.equal(0);

        const lpBalanceInVaultAfterDeposit : number  = await underlyingInstance.balanceOf(vaultAddress);
        console.log(`SLP-Balance In Vault After Deposit: ${lpBalanceInVaultAfterDeposit}`);

        const expectedVaultBalanceAfterDeposit : number = Number(lpBalanceOfDepositorBeforeDeposit) + Number(lpBalanceInVaultBeforeDeposit);
        expect(lpBalanceInVaultAfterDeposit).to.be.equal(expectedVaultBalanceAfterDeposit);

        const xlpBalanceAfterDeposit = await vaultInstance.balanceOf(depositor);
        console.log(`XLP-Balance of Depositor After Deposit is: ${xlpBalanceAfterDeposit}\n`);  

         const hardWorkTxResponse = await vaultInstance.connect(governanceSigner).doHardWork();
         await hardWorkTxResponse.wait();

        console.log(`\n--------------- HARD-WORK STARTS --------------\n`)

        const lpBalanceInVaultAfterFirstHardWork = await underlyingInstance.balanceOf(vaultAddress);
        console.log(`\nSLP-Balance In Vault After 1st HardWork: ${lpBalanceInVaultAfterFirstHardWork}`);
        expect(lpBalanceInVaultAfterFirstHardWork).to.be.equal(0);

         let xlpBalanceAfterHardwork = await vaultInstance.balanceOf(depositor);

        await ethers.provider.send("evm_increaseTime", [3600 * 24 * 10]);
        //await ethers.provider.send("evm_mine", []);

        const hardWorkTxResponse2 = await vaultInstance.connect(governanceSigner).doHardWork();
        await hardWorkTxResponse2.wait();

        const xlpBalanceAfterHardwork1 = await vaultInstance.balanceOf(depositor);
        console.log(`XLP-Balance Of Depositor After TimeAdvanced_Hardwork is: ${xlpBalanceAfterHardwork1} - ${typeof xlpBalanceAfterHardwork1}\n`);

        console.log(`\n--------------- HARD-WORK ENDS --------------\n`)

        const lpBalanceBeforeWithdraw = await underlyingInstance.balanceOf(depositor);
        console.log(`\nSLP-Balance of Depositor Before Withdraw: ${lpBalanceBeforeWithdraw}`);

        let xlpForWithdrawal = Number(xlpBalanceAfterHardwork1);

        console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING --------------\n`)

        const totalSupply = await vaultInstance.totalSupply();
        const withdrawFee = await vaultInstance.withdrawFee();
        const withdrawFeeShares = (Number(xlpForWithdrawal)*Number(withdrawFee))/(10 ** 18);
        console.log(`\nwithdrawFeeShares: ${withdrawFeeShares} computed using formula -> (XLP For Withdrawal: ${xlpForWithdrawal}) * (withdrawFee: ${withdrawFee}) / (10 ** 18)`);

        const numberOfSharesPostFee = Number(xlpForWithdrawal) - Number(withdrawFeeShares);
        console.log(`numberOfShares Post Fee: ${numberOfSharesPostFee} \n`);

        const calculatedSharePrice  = await vaultInstance.getPricePerFullShare();
        const underlyingUnit = await vaultInstance.underlyingUnit();
        const underlyingAmountToWithdraw = (Number(numberOfSharesPostFee) * Number(calculatedSharePrice))/underlyingUnit;
        console.log(`SLP To be Withdrawn to Depositor (Post Fee Deduction): ${underlyingAmountToWithdraw}`);

        let underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();

        const lpBalanceOfStrategyBeforeWithdraw = await underlyingInstance.balanceOf(strategyAddress);
        console.log(`SLP-Balance Of Strategy Before Withdraw: ${lpBalanceOfStrategyBeforeWithdraw}`);
        
        console.log(`\nabout to withdraw: ${xlpForWithdrawal} from strategy to vault: ${vaultAddress}`);

        console.log(`\n--------------- WITHDRAW-FEE MATH LOGGING ENDED --------------\n`)

        // const withdrawAllFromVaultTxn = await vaultInstance.connect(governanceSigner).withdrawAll();
        // await withdrawAllFromVaultTxn.wait();

        // underlyingBalanceInVault = await vaultInstance.underlyingBalanceInVault();
        // console.log(`SLP-Balance In Vault After withdrawAll: ${underlyingBalanceInVault}`);

        console.log(`\n--------------- WITHDRAW LOGGING --------------\n`)

        //74616502
        const withdrawTxnResponse = await vaultInstance.connect(depositorSigner).withdraw(xlpBalanceAfterHardwork1);
        await withdrawTxnResponse.wait();

        const lpBalanceAfterWithdraw = await underlyingInstance.balanceOf(depositor);
        console.log(`SLP-Balance of Depositor After Withdraw: ${lpBalanceAfterWithdraw} \n`);
        expect(Number(lpBalanceAfterWithdraw)).to.be.gt(Number(lpBalanceBeforeWithdraw));

        console.log(`\n--------------- WITHDRAW ENDED --------------\n`)
      });

    });

  });

});
