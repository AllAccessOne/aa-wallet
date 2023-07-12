import { ChainCore } from "@app/types/blockchain.type";
const hexToName: { [key: string]: string } = {
  "0xa9059cbb": "Transfer",
  "0x095ea7b3": "Approve",
  "0x23b872dd": "TransferFrom",
  "0x40c10f19": "Mint",
  "0x42966c68": "Burn",
};
export const transactionName = (hex: string, core: ChainCore) => {
  if (core === "evm") {
    const shortHex = hex.slice(0, 10);
    const name = hexToName[shortHex];
    if (name) return name;
    if (shortHex === "0x") {
      return "Transfer";
    }
    return shortHex;
  }
  return hex.slice(0, 10);
};
