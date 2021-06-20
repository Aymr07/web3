import Web3 from "web3";
import { constants, ethers } from "ethers";
import data, { ethURL, binanceURL } from "./data.json";
import fs from "fs";


(async () => {
    const provider = new ethers.providers.WebSocketProvider(data.ethWebsocket);

    const factory = new ethers.Contract(
        data.Uniswap.factory,
        ['event PairCreated(address indexed token0, address indexed token1, address pair, uint);']
    )

    const router = new ethers.Contract(
        data.Uniswap.router,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
        ],
    )
        factory.on("PairCreated", () => console.log(""))

})();