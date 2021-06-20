import Web3 from "web3";

(async () => {
    const url : string = "https://bsc-dataseed1.binance.org";
    const web3 = new Web3(url);
    web3.eth.getBlockNumber()
    .then(blockNumber => console.log(blockNumber))
    .catch(console.error)
})();



