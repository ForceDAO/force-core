export const network = "polygonmainnet";

export interface StrategyData {
    [strategyname: string] : Strategy;
}

export interface Strategy {
    pairName: string;
    sushiHodlStrategyFactoryAddress: string;
    miniChefV2: string;
    poolId: number;
    routerAddressV2: string;
    sushiTokenAddress: string;
    wmaticTokenAddress: string;
    routeSushiToken0: string[];
    routeSushiToken1: string[];
    routeWmaticToken0: string[];
    routeWmaticToken1: string[];
    masterChefHodlStrategyAddress: string;
}

export const strategies: StrategyData = {  
    "SUSHIHODL-WMATIC-WETH-V1": {
        pairName: "WMATIC-WETH",
        sushiHodlStrategyFactoryAddress: "",
        miniChefV2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        poolId: 0,
        routerAddressV2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiTokenAddress: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        wmaticTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        routeSushiToken0: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
        routeSushiToken1: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeWmaticToken0: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
        routeWmaticToken1: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        masterChefHodlStrategyAddress: ""
    },
    "SUSHIHODL-USDC-WETH-V1": {
        pairName: "USDC-WETH",
        sushiHodlStrategyFactoryAddress: "",
        miniChefV2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        poolId: 1,
        routerAddressV2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiTokenAddress: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        wmaticTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        routeSushiToken0: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"],
        routeSushiToken1: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeWmaticToken0: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"],
        routeWmaticToken1: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        masterChefHodlStrategyAddress: ""
    },
    "SUSHIHODL-WETH-USDT-V1": {
        pairName: "WETH-USDT",
        sushiHodlStrategyFactoryAddress: "",
        miniChefV2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        poolId: 2,
        routerAddressV2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiTokenAddress: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        wmaticTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        routeSushiToken0: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeSushiToken1: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"],
        routeWmaticToken0: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeWmaticToken1: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"],
        masterChefHodlStrategyAddress: ""
    },
    "SUSHIHODL-WETH-DAI-V1": {
        pairName: "WETH-DAI",
        sushiHodlStrategyFactoryAddress: "",
        miniChefV2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        poolId: 5,
        routerAddressV2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiTokenAddress: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        wmaticTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        routeSushiToken0: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeSushiToken1: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"],
        routeWmaticToken0: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"],
        routeWmaticToken1: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"],
        masterChefHodlStrategyAddress: ""
    },
    "SUSHIHODL-USDC-USDT-V1": {
        pairName: "USDC-USDT",
        sushiHodlStrategyFactoryAddress: "",
        miniChefV2: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
        poolId: 8,
        routerAddressV2: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        sushiTokenAddress: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        wmaticTokenAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        routeSushiToken0: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"],
        routeSushiToken1: ["0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],
        routeWmaticToken0: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"],
        routeWmaticToken1: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],
        masterChefHodlStrategyAddress: ""
    },
}  as StrategyData;