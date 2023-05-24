import Web3 from "web3";
import abi from "../common/ERC20_ABI.json";
import { FormData } from "../pages/Transaction";

export type TransferNative = {
  addressTo: string;
  amount: number;
  symbol: string;
  tokenContract?: string;
};

export const useBlockchain = (chainID: string = "1") => {
  try {
    const network = listNetWorks.find(n => n.chainID === chainID);
    const rpcUrl = network?.rpcUrls;
    const web3 = new Web3(rpcUrl ? rpcUrl : null);
    return { web3, getBalance, sendTransaction };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const getGasPrice = async (web3: Web3) => {
  const price = await web3.eth.getGasPrice();
  const ethValue = Math.round((parseInt(price, 16) / 10 ** 18) * 1000000) / 1000000;
  return ethValue;
};

export const formatValue = (web3: Web3, value: string) => {
  try {
    const formatBalance = web3.utils.fromWei(value, "ether");
    return formatBalance.slice(0, 5);
  } catch {
    return value;
  }
};
export const getBalance = async (web3: Web3, address: string, symbol: string = "ETH", tokenContract: string = "") => {
  try {
    if (tokenContract === "") {
      const balance = await web3.eth.getBalance(address);
      const formatBalance = web3.utils.fromWei(balance, "ether");
      return formatBalance.slice(0, 6);
    } else {
      const contractInstance = new web3.eth.Contract(abi as any, tokenContract);
      const balance = await contractInstance.methods
        .balanceOf(web3.defaultAccount)
        .call()
        .then((balance: string) => {
          return balance;
        });
      const formatBalance = web3.utils.fromWei(balance, "ether");
      return formatBalance.slice(0, 6);
    }
  } catch {
    return "0";
  }
};

export const sendTransaction = async (web3: Web3, data: FormData, privateKey: string) => {
  const { addressTo, amount, token, tokenContract } = data;
  try {
    if (!tokenContract) {
      const weiValue = Math.round(parseFloat(amount) * 10 ** 18);
      const hexValue = web3.utils.toHex(weiValue ? weiValue : 0);
      const price = await web3.eth.getGasPrice();
      const tx = {
        to: addressTo,
        from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
        value: hexValue,
        gas: 210000,
        gasPrice: price,
        data: "0x",
      };
      const signedTransaction: any = await web3.eth.accounts.signTransaction(tx, privateKey);
      const sendSignedTransaction = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      console.log(sendSignedTransaction.transactionHash);
      return sendSignedTransaction.transactionHash;
    } else {
      const tokenAddress = new web3.eth.Contract(abi as any, tokenContract);
      const price = await web3.eth.getGasPrice();

      const recipient = addressTo;
      const value = web3.utils.toWei(amount, "ether");
      const transferData = tokenAddress.methods.transfer(recipient, value).encodeABI();

      const transactionObject = {
        from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
        to: tokenAddress.options.address,
        gas: await tokenAddress.methods.transfer(recipient, value).estimateGas({ from: web3.defaultAccount }),
        gasPrice: price,
        data: transferData,
      };
      const signedTransaction: any = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
      const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      return transactionReceipt.transactionHash;
    }
  } catch (error) {
    return error;
  }
};

export const listNetWorks: ChainNetwork[] = [
  {
    chainID: "1",
    apiScan: `https://api.etherscan.io/api?module=account&action=txlist&address={address}&sort=asc&apikey=6YA3MRG422USB7DWGGQTWHDZTUG248ZKJ5`,
    rpcUrls: "https://eth.llamarpc.com",
  },
  {
    chainID: "5",
    apiScan: `https://api-goerli.etherscan.io/api?module=account&action=txlist&address={address}&sort=asc&apikey=6YA3MRG422USB7DWGGQTWHDZTUG248ZKJ5`,
    rpcUrls: "https://goerli.blockpi.network/v1/rpc/public",
  },
  {
    chainID: "56",
    apiScan: "https://api.bscscan.com/api?module=account&action=txlist&address={address}&sort=asc&apikey=I1JJ6MQZRU7BG9WNH1FU69M3T377FIC4JW",
    rpcUrls: "https://bsc-dataseed1.binance.org",
  },
];
export type ChainNetwork = {
  chainID: string;
  apiScan: string;
  rpcUrls: string;
};
