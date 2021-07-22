import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import {
  SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT,
  SUSHISWAP_V2_ROUTER02_ADDRESS,
  USDC_ADDRESS, USDC_WHALE_ADDRESS,
  USDT_ADDRESS, USDT_WHALE_ADDRESS,
  SUSHI_ADDRESS,
  WMATIC_ADDRESS,
  SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0,
  SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1,
  SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0,
  SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1,
  MINICHEFV2,
  POOL_ID_USDC_USDT,
  COMPLEX_REWARDER_TIME,
} from "../../../polygon-mainnet-fork-test-config";

import { legos } from "@studydefi/money-legos";

import { sushiHodlBehavior } from "./masterchef-sushihodl-strategy-test-behaviour";
import { StrategyTestData, Accounts, Strategy, Vault } from "./masterchef-sushihodl-strategy-testprep-helper";
import { BigNumber } from "ethers";


describe("MasterChefV2 E2E - mainnet fork Tests", function () {

    const SUPPLY_CAP: number = 100089694;
    const TO_INVEST_NUM: number = 1000;
    const TO_INVEST_DEN: number = 1000;
    const UNDERLYING_ADDRESS: string = SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT;
    const WITHDRAW_FEE: number = 10;

    const USDC_DEPOSIT_AMOUNT = BigNumber.from(100000)
        .mul(BigNumber.from(10).pow(6));
    const USDT_DEPOSIT_AMOUNT = BigNumber.from(100000)
        .mul(BigNumber.from(10).pow(6))

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

    let beneficiary: string;
    let beneficiarySigner: any;

    let mockDepositor: any;
    let mockDepositorAddress: string;

    let strategyTestData: StrategyTestData;

    const prepareEnv = async () => {

        [governanceSigner, depositorSigner, controllerSigner, beneficiarySigner] = await ethers.getSigners();
        governanceAddress = governanceSigner.address;
        depositor = depositorSigner.address;
        controllerAddress = controllerSigner.address;
        beneficiary = beneficiarySigner.address;

        // Deploy Storage.
        const Storage = await ethers.getContractFactory("Storage");
        storageInstance = await Storage.deploy();
        storageAddress = storageInstance.address;
        expect(governanceAddress).to.be.equal(await storageInstance.governance.call());

        // Deploy Strategy Factory.
        const SushiHodlStrategyFactory = await ethers.getContractFactory("SushiHodlStrategyFactory");
        strategyFactoryInstance = await SushiHodlStrategyFactory.deploy();
        strategyFactoryAddress = strategyFactoryInstance.address;

        // Deploy Vault.
        const vaultContract = await ethers.getContractFactory(`contracts/Vault.sol:Vault`);
        vaultInstance = await upgrades.deployProxy(
            vaultContract, 
            [storageAddress, UNDERLYING_ADDRESS, TO_INVEST_NUM, TO_INVEST_DEN, SUPPLY_CAP],
            {
                initializer: 'initializeVault(address,address,uint256,uint256,uint256)', 
                unsafeAllow: ['constructor'],
                unsafeAllowCustomTypes: true
            }
        );

        vaultAddress = vaultInstance.address;

        // Create Strategy from Factory call.
        const sushiHodlStrategyCreationTransactionResponse = await strategyFactoryInstance.createSushiHodlStrategy(
            storageAddress,
            UNDERLYING_ADDRESS,
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
        const strategyTransactionBlockHash = sushiHodlStrategyCreationTransactionResponse.blockHash;

        // get Event Logs of strategy Creation
        const transactionLogs = await ethers.provider.getLogs(strategyTransactionBlockHash);

        // extract strategyAddress from EventLogs
        strategyAddress = transactionLogs[0].topics[1].replace("0x000000000000000000000000", "0x");

        strategyInstance = await ethers.getContractAt(
            "MasterChefHodlStrategy",
            strategyAddress
        );
        
        // Set Supply Cap on Vault.
        const totalSupplyCapTxnResponse = await vaultInstance.setTotalSupplyCap(SUPPLY_CAP);
        await totalSupplyCapTxnResponse.wait();
        
        // Set Controller on Vault.
        const setControllerTransaction = await storageInstance.setController(controllerAddress);
        await setControllerTransaction.wait();

        // Impersonate accounts.
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT]
        });

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE_ADDRESS]
        });
        
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDT_WHALE_ADDRESS]
        });
            
        const usdcWhaleSigner = await ethers.provider.getSigner(USDC_WHALE_ADDRESS);
        expect(usdcWhaleSigner).to.not.be.null; 
        const usdtWhaleSigner = await ethers.provider.getSigner(USDT_WHALE_ADDRESS);
        expect(usdtWhaleSigner).to.not.be.null;

        // Add liquidity.
        const usdcInstance = await ethers.getContractAt("IERC20", USDC_ADDRESS);
        await usdcInstance.connect(usdcWhaleSigner).transfer(depositor, USDC_DEPOSIT_AMOUNT);
        const usdtInstance = await ethers.getContractAt("IERC20", USDT_ADDRESS);
        await usdtInstance.connect(usdtWhaleSigner).transfer(depositor, USDT_DEPOSIT_AMOUNT);

        await usdcInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, USDC_DEPOSIT_AMOUNT);
        await usdtInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, USDT_DEPOSIT_AMOUNT);

        underlyingInstance = await ethers.getContractAt("IUniswapV2Pair", SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT);   
        
        routerInstance = await ethers.getContractAt("IUniswapV2Router02", SUSHISWAP_V2_ROUTER02_ADDRESS);
        const NOW_PLUS_DAY = Math.floor(new Date().getTime() / 1000) + 86400;
        await routerInstance.connect(depositorSigner).addLiquidity(
            USDC_ADDRESS,
            USDT_ADDRESS,
            USDC_DEPOSIT_AMOUNT,
            USDT_DEPOSIT_AMOUNT,
            0,
            0,
            depositor,
            NOW_PLUS_DAY
        );

        strategyInstance = await ethers.getContractAt("MasterChefHodlStrategy", strategyAddress);
        expect(strategyInstance).to.not.be.null;
        vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
        expect(vaultInstance).to.not.be.null;

        const setWithdrawFeeTxn = await vaultInstance.connect(governanceSigner).setWithdrawFee(WITHDRAW_FEE);
        await setWithdrawFeeTxn.wait();

        const MockDepositor = await ethers.getContractFactory("MockVaultDepositor");
        mockDepositor = await MockDepositor.deploy();
        mockDepositorAddress = mockDepositor.address;

        // Set test data.
        const testVault: Vault = {
            vaultAddress,
            underlying: underlyingInstance.address,
            toInvestNumerator: TO_INVEST_NUM,
            toInvestDenominator: TO_INVEST_DEN,
            totalSupplyCap: SUPPLY_CAP,
            storageAddress: storageAddress
        };

        const testStrategy: Strategy = {
            strategyAddress,
            underlying: underlyingInstance.address,
            miniChefV2: MINICHEFV2,
            mockDepositorAddress: mockDepositorAddress,
            complexRewarderTime: COMPLEX_REWARDER_TIME
        };

        const testAccounts: Accounts = {
            governanceSigner,
            controllerSigner,
            depositorSigner,
            beneficiarySigner
        };

        return strategyTestData = {
            Vault: testVault,
            Strategy: testStrategy,
            Accounts: testAccounts
        };

    };

    sushiHodlBehavior(prepareEnv);

});