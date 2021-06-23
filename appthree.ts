import { ethers, Contract, utils, BigNumber } from "ethers";
import { erc20, bsc20, tokenABI } from "./dataa.json";

(async(tokenAddress: string): Promise<any> => {
    const provider = new ethers.providers.JsonRpcProvider(erc20.api);

    // The router address, which contains the function getAmountsOut() used to retreive the price
    const router: Contract = new Contract(
        erc20.swap.router.address,
        erc20.swap.router.ABI,
        provider
    )
        // Creates a temporary contract of the token. Used to identify name etc...
    const tempContract: Contract = new Contract(tokenAddress, tokenABI, provider);

        // Creates a BigNumber object representing 1 ETHER (NOTE: Ether is a value used to represent the amount of Ethereum, similar to wei/gwei)
    const oneETH: BigNumber = utils.parseUnits('1', "ether");

    // Retrieves the price of Ethereum (WETH is literally Ethereum FYI) represented in wei
    const etherPrice : BigNumber[] = await router.getAmountsOut(oneETH, [
        erc20.swap.WETH,
        erc20.usdt
    ])

    // Retrieves the price of the token against Ethereum
    const tokenPrice : BigNumber[] = await router.getAmountsOut(oneETH, [
        erc20.swap.WETH,
        tokenAddress,
    ])

    // Converts wei to mwei, which is equivalent to ETH/USDT
    let etherPriceUSD : string = utils.formatUnits(etherPrice[1] ,"mwei");

    // You apparently need 18 decimals to format your shit. Don't ask why.
    // I saw 18 somewhere and remembered.
    // Now this truly becomes TOKEN/(W)ETH
    let tokenPriceOverEth : string = utils.formatUnits(tokenPrice[1], 18)

    // Now, you'll get your TOKEN/USDT. Voila
    let finalPrice = parseInt(etherPriceUSD) / parseInt(tokenPriceOverEth);

    console.log(finalPrice)

    return finalPrice;
})("0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9")
