export interface SushiHodlStrategyConfig {
    network : string;
    sushiHodlStrategyFactoryAddress: string;
    underlying: string;
    miniChefV2: string;
    poolId: string;
    routerAddressV2: string;
    sushiTokenAddress: string;
    wmaticTokenAddress: string;
    routeSushiToken0: Array<String>;
    routeSushiToken1: Array<String>;
    routeWmaticToken0: Array<String>;
    routeWmaticToken1: Array<String>;
}

const sushiHodlStrategyConfig = {  
    network : "polygonmumbai",
    sushiHodlStrategyFactoryAddress: "",
    underlying: "",
    miniChefV2: "",
    poolId: "",
    routerAddressV2: "",
    sushiTokenAddress: "",
    wmaticTokenAddress: "",
    routeSushiToken0: ["", ""],
    routeSushiToken1: ["", ""],
    routeWmaticToken0: ["", ""],
    routeWmaticToken1: ["", ""]
}

export default sushiHodlStrategyConfig as any;