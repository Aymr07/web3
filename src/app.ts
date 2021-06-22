import Web3 from "web3";
import { ethers, providers } from "ethers";
import data from "./data.json";
import fs from "fs";
import uniswapABI from "./IUniswapV2Factory.json";
import tokenABI from "./erc20abi.json"

function setDecimals(number, decimals) {
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while (numberDecimals.length < decimals) {
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}


(async () => {
    const provider = new ethers.providers.WebSocketProvider(data.eth.websocket);
    const wallet = new ethers.Wallet(data.privateKey, provider);
    console.log(wallet)


})();