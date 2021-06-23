import { ethers, Contract, utils, BigNumber } from "ethers";
import { erc20, bsc20, tokenABI } from "./dataa.json";

(async(tokenAddress: string): Promise<any> => {
    const provider = new ethers.providers.JsonRpcProvider(bsc20.api);

    // The router address, which contains the function getAmountsOut() used to retreive the price
    const router: Contract = new Contract(
        bsc20.swap.router.address,
        bsc20.swap.router.ABI,
        provider
    )
        // Creates a temporary contract of the token. Used to identify name etc...
   // const tempContract: Contract = new Contract(tokenAddress, tokenABI, provider);

        // Creates a BigNumber object representing 1 ETHER (NOTE: Ether is a value used to represent the amount of Ethereum, similar to wei/gwei)
    const oneETH: BigNumber = utils.parseUnits('1', "ether");

    // Retrieves the price of Ethereum (WETH is literally Ethereum FYI) represented in wei
    const etherPrice : BigNumber[] = await router.getAmountsOut(oneETH, [
        bsc20.swap.WBNB,
        bsc20.usdt
    ])

    // Retrieves the price of the token against Ethereum
    const tokenPrice : BigNumber[] = await router.getAmountsOut(oneETH, [
        bsc20.swap.WBNB,
        tokenAddress,
    ])

    // Converts wei to mwei, which is equivalent to ETH/USDT
    let etherPriceUSD : string = utils.formatUnits(etherPrice[1] ,"ether");

    // You apparently need 18 decimals to format your shit. Don't ask why.
    // I saw 18 somewhere and remembered.
    // Now this truly becomes TOKEN/(W)ETH
    let tokenPriceOverEth : string = utils.formatUnits(tokenPrice[1], "gwei")

    // Now, you'll get your TOKEN/USDT. Voila
    let finalPrice = parseInt(etherPriceUSD) / parseInt(tokenPriceOverEth);

    // console.log(utils.formatUnits(tokenPrice[1].toString(), "gwei"))
    
    console.log(finalPrice)

    return "finalPrice";
})("0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3")

// 98429300
// 98415760.358951638
// 98414934315.259125
// 98431442205470259
