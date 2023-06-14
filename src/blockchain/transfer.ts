import Web3 from "web3";
import { FormData } from "../pages/Transaction/Transfer/type";
import { privateKey } from "../configs/data/test";
import abi from "../common/ERC20_ABI.json";
import { useState } from "react";
export const sendTransaction = async (
  web3: Web3,
  data: FormData,
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>,
  setInfoTransaction: React.Dispatch<React.SetStateAction<string>>
) => {
  const { addressTo, amount } = data;
  try {
    const weiValue = Math.round(parseFloat(amount) * 10 ** 18);
    const hexValue = web3.utils.toHex(weiValue ? weiValue : 0);

    const price = await web3.eth.getGasPrice();
    const gasLimit = await web3.eth.estimateGas({
      to: addressTo,
      from: web3.defaultAccount as string,
      value: hexValue,
      data: "0x",
    });

    const tx = {
      to: addressTo,
      from: web3.defaultAccount as string,
      value: hexValue,
      gas: gasLimit,
      gasPrice: price,
      data: "0x",
    };
    const signedTransaction: any = await web3.eth.accounts.signTransaction(tx, privateKey);
    const sendSignedTransaction = web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    sendSignedTransaction.on("transactionHash", transactionHash => {
      setTransactionHash(transactionHash);
      setInfoTransaction("pending");
    });
    await sendSignedTransaction;
    setInfoTransaction("success");
    setTransactionHash("");
  } catch (error) {
    setInfoTransaction("Error");
  }
};
export const sendTransactionToken = async (
  web3: Web3,
  data: FormData,
  tokenContract: string,
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>,
  setInfoTransaction: React.Dispatch<React.SetStateAction<string>>
) => {
  const { addressTo, amount } = data;
  try {
    const tokenAddress = new web3.eth.Contract(abi as any, tokenContract);
    const price = await web3.eth.getGasPrice();
    const recipient = addressTo;
    const value = web3.utils.toWei(amount, "ether");
    const transferData = tokenAddress.methods.transfer(recipient, value).encodeABI();
    const transactionObject = {
      from: web3.defaultAccount as string,
      to: tokenAddress.options.address,
      gas: await tokenAddress.methods.transfer(recipient, value).estimateGas({ from: web3.defaultAccount }),
      gasPrice: price,
      data: transferData,
    };
    const signedTransaction: any = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
    const transactionReceipt = web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    transactionReceipt.on("transactionHash", transactionHash => {
      setTransactionHash(transactionHash);
      setInfoTransaction("pending");
    });
    await transactionReceipt;
    setInfoTransaction("success");
    setTransactionHash("");
  } catch (error) {
    setInfoTransaction("Error");
  }
};
