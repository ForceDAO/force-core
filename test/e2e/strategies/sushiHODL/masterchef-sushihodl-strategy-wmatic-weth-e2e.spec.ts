import { ethers, upgrades, network } from "hardhat";
import { expect, use } from "chai";
import {
  MATIC_WHALE_ADDRESS,
  SUSHI_LP_UNDERLYING_ADDRESS_WMATIC_WETH,
  SUSHISWAP_V2_ROUTER02_ADDRESS,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  WMATIC_ADDRESS, WMATIC_WHALE_ADDRESS,
  WETH_ADDRESS, WETH_WHALE_ADDRESS,
  SUSHI_ADDRESS,
  SUSHI_LP_WMATIC_WETH_SUSHI_ROUTE_0,
  SUSHI_LP_WMATIC_WETH_SUSHI_ROUTE_1,
  SUSHI_LP_WMATIC_WETH_WMATIC_ROUTE_0,
  SUSHI_LP_WMATIC_WETH_WMATIC_ROUTE_1,
  MINICHEFV2,
  COMPLEX_REWARDER_TIME,
  POOL_ID_WMATIC_WETH,
} from "../../../polygon-mainnet-fork-test-config";

import { sushiHodlBehavior } from "./masterchef-sushihodl-strategy-test-behaviour";
import { StrategyTestData, Accounts, Strategy, Vault } from "./masterchef-sushihodl-strategy-testprep-helper";
import { BigNumber } from "ethers";


describe("MasterChefV2 E2E - mainnet fork Tests", function () {

    const SUPPLY_CAP: number = 100089694;
    const TO_INVEST_NUM: number = 1000;
    const TO_INVEST_DEN: number = 1000;
    const UNDERLYING_ADDRESS: string = SUSHI_LP_UNDERLYING_ADDRESS_WMATIC_WETH;
    const WITHDRAW_FEE: number = 10;

    const WMATIC_DEPOSIT_AMOUNT = BigNumber.from(208310)
        .mul(BigNumber.from(10).pow(18));
    const WETH_DEPOSIT_AMOUNT = BigNumber.from(1890)
        .mul(BigNumber.from(10).pow(18))

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

    let beneficiarySigner: any;
    let beneficiaryAddress: string;

    let mockDepositor: any; 
    let mockDepositorAddress: string;

    let strategyTestData: StrategyTestData;


    const prepareEnv = async () => {

        [governanceSigner, depositorSigner, controllerSigner, beneficiarySigner] = await ethers.getSigners();
        governanceAddress = governanceSigner.address;
        depositor = depositorSigner.address;
        controllerAddress = controllerSigner.address;

        // Impersonate accounts.

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [MATIC_WHALE_ADDRESS]
        });
        
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [SUSHI_LP_UNDERLYING_ADDRESS_WMATIC_WETH]
        });

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [WMATIC_WHALE_ADDRESS]
        });
        
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [WETH_WHALE_ADDRESS]
        });
                    
        const maticWhaleSigner = await ethers.provider.getSigner(MATIC_WHALE_ADDRESS);
        expect(maticWhaleSigner).to.not.be.null; 
        const wmaticWhaleSigner = await ethers.provider.getSigner(WMATIC_WHALE_ADDRESS);
        expect(wmaticWhaleSigner).to.not.be.null; 
        const wethWhaleSigner = await ethers.provider.getSigner(WETH_WHALE_ADDRESS);
        expect(wethWhaleSigner).to.not.be.null;

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
            POOL_ID_WMATIC_WETH,
            SUSHISWAP_V2_ROUTER02_ADDRESS,
            SUSHI_ADDRESS,
            WMATIC_ADDRESS,
            SUSHI_LP_WMATIC_WETH_SUSHI_ROUTE_0,
            SUSHI_LP_WMATIC_WETH_SUSHI_ROUTE_1,
            SUSHI_LP_WMATIC_WETH_WMATIC_ROUTE_0,
            SUSHI_LP_WMATIC_WETH_WMATIC_ROUTE_1
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

        const MockDepositor = await ethers.getContractFactory("MockVaultDepositor");
        mockDepositor = await MockDepositor.deploy();
        mockDepositorAddress = mockDepositor.address;

        // Add liquidity.
        const wmaticInstance = await ethers.getContractAt("IERC20", WMATIC_ADDRESS);
        await wmaticInstance.connect(wmaticWhaleSigner).transfer(depositor, WMATIC_DEPOSIT_AMOUNT);
        const wethInstance = await ethers.getContractAt("IERC20", WETH_ADDRESS);
        await wethInstance.connect(wethWhaleSigner).transfer(depositor, WETH_DEPOSIT_AMOUNT);

        await wmaticInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, WMATIC_DEPOSIT_AMOUNT);
        await wethInstance.connect(depositorSigner).approve(SUSHISWAP_V2_ROUTER02_ADDRESS, WETH_DEPOSIT_AMOUNT);

        underlyingInstance = await ethers.getContractAt("IUniswapV2Pair", SUSHI_LP_UNDERLYING_ADDRESS_WMATIC_WETH);   
        
        routerInstance = await ethers.getContractAt("IUniswapV2Router02", SUSHISWAP_V2_ROUTER02_ADDRESS);
        const NOW_PLUS_DAY = Math.floor(new Date().getTime() / 1000) + 86400;

          await routerInstance.connect(depositorSigner).addLiquidity(
            WMATIC_ADDRESS,
            WETH_ADDRESS,
            WMATIC_DEPOSIT_AMOUNT,
            WETH_DEPOSIT_AMOUNT,
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

        // Set test data.
        const testVault: Vault = {
            vaultAddress,
            underlying: underlyingInstance.address,
            uniFactory: SUSHISWAP_V2_FACTORY_ADDRESS,
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