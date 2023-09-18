import Web3 from "web3";


export default class BlockchainService {
    WEB3;
    chainId;
    gasPrice;
    maxFeePerGas;

    constructor(RPC, chainId, gasBasePrice) {
        this.WEB3 = new Web3(
            new Web3.providers.HttpProvider(RPC)
        );
        this.chainId = chainId;
        this.gasPrice = gasBasePrice; 
        this.maxFeePerGas = gasBasePrice; 
    }
}