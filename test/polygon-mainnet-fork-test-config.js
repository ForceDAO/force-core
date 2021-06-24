module.exports = {

  ZERO_ADDRESS :  "0x0000000000000000000000000000000000000000",

  WMATIC_ADDRESS :  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  FORCE_ADDRESS :  "0xdf4d2226c810976c582a8111d831fa5fc543f7e5",
  SUSHI_ADDRESS :  "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",

  //USDC ADDRESS
  USDC_WHALE_ADDRESS: "",
  USDC_ADDRESS: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",

  // USDT
  USDT_ADDRESS: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  USDT_WHALE_ADDRESS: "",

  // SushiSwapV2-Router
  SUSHISWAP_V2_ROUTER02_ADDRESS: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",

  STRATEGY_OWNER :  "0x9782968954A2948EB5A611235b7E3D227457DeC0",
  STORAGE_ADDRESS: "0x7E428A383D0F3A3B8e2D4a0cA2cDde8792878e2c",
  STATICS_HELPER_ADDRESS: "0xC1f99f723C7bDF1313140BFA29390138F1b325bf",

  //SushiHODL-Factory Address
  SUSHI_HODL_FACTORY_ADDRESS : "0x274Fd47DE106dB114Bd87f7c52e28996B5F066f9",
  
  //Strategy-Vault (MasterChefHodlStrategy) for USDC-USDT
  SUSHI_LP_UNDERLYING_ADDRESS_USDC_USDT : "0x4B1F1e2435A9C96f7330FAea190Ef6A7C8D70001",
  VAULT_ADDRESS_USDC_USDT: "0x8D7f8722B796526B7DBe94055cb405148cc47719",
  MASTER_CHEF_HODL_STRATEGY_ADDRESS_USDC_USDT :  "0x5e6dccb2df12d78c13fb1e3195f05f1afefce5d1",
  
  //Routes for WMATIC & SUSHI in MasterChefHodlStrategy (USDC-USDT)
  SUSHI_LP_USDC_USDT_WMATIC_ROUTE_0 : [WMATIC_ADDRESS, USDC_ADDRESS],
  SUSHI_LP_USDC_USDT_WMATIC_ROUTE_1 : [WMATIC_ADDRESS, USDT_ADDRESS],
  SUSHI_LP_USDC_USDT_SUSHI_ROUTE_0 : [SUSHI_ADDRESS, USDC_ADDRESS],
  SUSHI_LP_USDC_USDT_SUSHI_ROUTE_1 : [SUSHI_ADDRESS, USDT_ADDRESS],

};
