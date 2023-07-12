import Web3 from "web3";
import abi from "../../common/ERC20_ABI.json";
import { AbiItem } from "web3-utils";
import { Token } from "../../types/blockchain.type";
import { LogoNew } from "../../assets/img";
import axios from "axios";
export const getToken = async (web3: Web3, addressToken: string) => {
  const symbolToken = await getSymbolToken(web3, addressToken);
  const nameToken = await getNameToken(web3, addressToken);
  const urlToken = "https://api.coingecko.com/api/v3/coins/" + nameToken.toLowerCase().split(" ")[0];
  const infoToken = await axios.get(urlToken).catch(() => {
    return null;
  });
  const logoToken = infoToken?.data.image.small || LogoNew;

  if (symbolToken && nameToken) {
    return {
      img: logoToken,
      symbol: symbolToken,
      name: nameToken,
      tokenContract: addressToken,
    } as Token;
  } else {
    return null;
  }
};

const getNameToken = async (web3: Web3, addressToken: string) => {
  try {
    const tokenContract = new web3.eth.Contract(abi as AbiItem[], addressToken);

    const name: string = await tokenContract.methods.name().call();
    return name;
  } catch {
    return "";
  }
};

const getSymbolToken = async (web3: Web3, addressToken: string) => {
  try {
    const tokenContract = new web3.eth.Contract(abi as AbiItem[], addressToken);

    const symbol: string = await tokenContract.methods.symbol().call();
    return symbol;
  } catch {
    return "";
  }
};
