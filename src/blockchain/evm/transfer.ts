import Web3 from "web3";
import { parseUnits } from "ethers";
import { AbiItem } from "web3-utils";
import ERC20_ABI from "@app/common/ERC20_ABI.json";
import { Callbacks, DefaultCallbacks, TransferNative, TransferToken } from "../types";
export const transfer = async (web3: Web3, data: TransferNative, callbacks: Callbacks = DefaultCallbacks) => {
  const { onError, onHash, onSuccess } = callbacks;
  try {
    const { recipient, amount } = data;
    const weiValue = Math.round(parseFloat(String(amount)) * 10 ** 18);
    const hexValue = web3.utils.toHex(weiValue ? weiValue : 0);
    const price = await web3.eth.getGasPrice();

    const gasLimit = await web3.eth.estimateGas({
      to: recipient,
      from: web3.defaultAccount as string,
      value: hexValue,
      data: "0x",
    });

    const tx = {
      to: recipient,
      from: web3.defaultAccount as string,
      value: hexValue,
      gas: gasLimit as number,
      gasPrice: price,
      data: "0x",
    };

    const sendSignedTransaction = web3.eth.sendTransaction(tx);
    sendSignedTransaction
      .on("transactionHash", transactionHash => {
        onHash(transactionHash);
      })
      .on("receipt", receipt => {
        onSuccess(receipt.transactionHash);
        return;
      })
      .on("error", error => {
        onError(error.message);
        return;
      });
  } catch (error: any) {
    onError(error?.message || "Unknown error");
  }
};
export const transferToken = async (web3: Web3, data: TransferToken, callbacks: Callbacks) => {
  const { onError, onHash, onSuccess } = callbacks;
  const { recipient, amount, tokenContract } = data;
  const tokenAddress = new web3.eth.Contract(ERC20_ABI as AbiItem[], tokenContract);
  const [price, decimals] = await Promise.all([web3.eth.getGasPrice(), tokenAddress.methods.decimals().call()]);
  const value = parseUnits(amount, Number(decimals));
  const transferData = tokenAddress.methods.transfer(recipient, value).encodeABI();
  const gasLimit = await tokenAddress.methods.transfer(recipient, value).estimateGas({ from: web3.defaultAccount });

  const transactionObject = {
    from: web3.defaultAccount as string,
    to: tokenAddress.options.address,
    gas: gasLimit,
    gasPrice: price,
    data: transferData,
  };
  const transactionReceipt = web3.eth.sendTransaction(transactionObject);
  transactionReceipt
    .on("transactionHash", transactionHash => {
      onHash(transactionHash);
    })
    .on("receipt", () => {
      onSuccess("success");
      return;
    })
    .on("error", error => {
      onError(error.message);
      onHash("");
      return;
    });
};
