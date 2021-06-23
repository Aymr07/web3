import { BigNumber, ethers, providers } from 'ethers';
import data from "./data.json";
(async () => {

  const addresses = {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  }

  const provider = new ethers.providers.WebSocketProvider(data.eth.websocket);
  const wallet = new ethers.Wallet(data.privateKey);
  const account = wallet.connect(provider);

  const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  );

  const router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    account
  );
  console.log("Activated. Waiting for new tokens...")
  const ETHPrice: BigNumber = await getETHPrice(router);


  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    console.log(`New pair detected
  =================
  token0: ${token0}
  token1: ${token1}
  pairAddress: ${pairAddress}`);

    //   The quote currency needs to be WETH (we will pay with WETH)
    let tokenIn, tokenOut;
    if (token0 === addresses.WETH) {
      tokenIn = token0;
      tokenOut = token1;
    }

    if (token1 == addresses.WETH) {
      tokenIn = token1;
      tokenOut = token0;
    }

    //The quote currency is not WETH
    if (typeof tokenIn === 'undefined') {
      return;
    }

    //We buy for 1 ETH of the new token
    const amountIn = ethers.utils.parseUnits('1', 'ether');
    const amounts : BigNumber[] = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);

    //Our execution price will be a bit different, we need some flexbility
    const amountOutMin = amounts[1].sub(amounts[1].div(10));
    console.log('dividing', ETHPrice.toBigInt(), 'by' , amountOutMin.toBigInt())

    console.log(`
      Buying new token
      =================
      tokenIn: ${amountIn.toString()} ${tokenIn} (WETH)
      tokenOut: ${amountOutMin.toString()} ${tokenOut}
    `);

  });
})();

async function getBNBPrice() {
  const provider = new ethers.providers.JsonRpcProvider(data.binance.url);
  let BNBtoSell = ethers.utils.parseUnits("1", "ether");
  const wallet = new ethers.Wallet(data.privateKey);
  const account = wallet.connect(provider);
  var amountOut: BigNumber[];

  try {
    let router = new ethers.Contract(data.pancake_swap, ['function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)'], account);
    amountOut = await router.getAmountsOut(BNBtoSell, [data.binance.contract, data.binance.USDTokenAddress]);
  } catch (error) {
    console.error
  }

}

async function getETHPrice(router: ethers.Contract): Promise<BigNumber> {
  let ETHtoSell = ethers.utils.parseUnits("1", "ether");
  var amountOut: BigNumber[];
  var addy = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

  try {
    //let router = new ethers.Contract(data.Uniswap.router, ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'], account);
    amountOut = await router.getAmountsOut(ETHtoSell, [data.Uniswap.WETH, data.usdt.contract]);
    console.log(amountOut)
    console.log(ethers.utils.formatUnits(amountOut[1], 18))
  } catch (error) {
    // console.error
    
  }

  const amounts : BigNumber[] = await router.getAmountsOut(ETHtoSell, [data.Uniswap.WETH, addy]);
  console.log(amountOut[1].toNumber() / parseInt(amounts[1].toString()))
  

  return amountOut[1];

}