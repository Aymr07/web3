import Web3 from "web3";
import { ethers, providers, Contract, utils, BigNumber } from "ethers";
import data from "./data.json";
import fs from "fs";
import uniswapABI from "./IUniswapV2Factory.json";
import tokenABI from "./erc20abi.json"

(async () => {


    // const provider = new ethers.providers.WebSocketProvider(data.eth.websocket);
    const provider = new ethers.providers.JsonRpcProvider(data.eth.url);

    // Connect to the factroy, which checks for newly released events
    const factory = new Contract(
        data.Uniswap.factory,
        ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
        provider);

    // The router address, which contains the function getAmountsOut()
    const router = new Contract(
        data.Uniswap.router,
        ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            "function name() view returns (string)",
            "function balanceOf(address) view returns (uint)",
            "function symbol() view returns (string)"],
        provider);

    /**
     * @name   "PairCreated"
     * @param  {} token0 - Should be the token that we are looking for
     * @param  {} token1 - Address of WETH
     * @param  {} pairAddress - The pair address between token0/token1
     */
    //factory.on("PairCreated", async (token0, token1, pairAddress) => {
        // console.log("New token detected!")
        // console.log("--------------------------")
        // console.log(`Token0 : ${token0}`);
        // console.log(`Token1 : ${token1}`);
        // console.log(`Pair Address : ${pairAddress}`);

        var token0 = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";


        const tokenABI = [
            "function name() view returns (string)",
            "function balanceOf(address) view returns (uint)",
            "function symbol() view returns (string)",
        ]

        const tempContract = new Contract(token0, tokenABI, provider);
        var i = await tempContract.name();
        console.log(i)

        var oneETH = ethers.utils.parseUnits('1', "ether");

        var x : BigNumber[] = await router.getAmountsOut(oneETH, [
            data.Uniswap.WETH,
            data.usdt.contract,
        ])


        var y = await router.getAmountsOut(oneETH, [
            data.Uniswap.WETH,
            token0,
        ])
        console.log(utils.formatUnits(y[1], 18))
        
        

    //})

    // 294957066140613672997957048
    // 294959000
    // 294903397.844526656507091548
    // 294954938554715064437.292536

    // const uniContract = new ethers.Contract(uniSwapAddress, uniABI, providerw)



})();

//73711545686945334284006