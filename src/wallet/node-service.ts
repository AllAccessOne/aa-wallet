
// import FetchNodeDetails from "@allaccessone/fetch-node-details";
// import TorusUtils from "@allaccessone/allaccessone.js";
// import { BN } from "bn.js";
// import { generatePublicKeyFromPrivateKey } from "./algorithm";


import { KeyPair } from "./types";

export const getNodeKey = async (verifier: string, verifierId: string, idToken: string): Promise<KeyPair> => {

  // const fetchNodes = new FetchNodeDetails({ network: "local", proxyAddress: "0xD44F7724b0a0800e41283E97BE5eC9E875f59811" });
  // const nodesList = await fetchNodes.getNodeDetails();
  // const torus = new TorusUtils({ network: "testnet" });
  console.log(verifier, verifierId, idToken);
  // const { torusNodeEndpoints, torusIndexes } = nodesList;
  // const keyData = await torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, { verifier_id: verifierId }, idToken, {});
  // return {
  //   ethAddress: keyData.ethAddress,
  //   priKey: keyData.privKey,
  //   pubKey: generatePublicKeyFromPrivateKey(new BN(keyData.privKey, "hex")).toString("hex").padStart(130, "0"),
  // };
  return {
    ethAddress: "0x2e123e87AB37B2bE44b511Cde15c19c785a840D7",
    priKey: "2360afae7497c84aac89470fb9b5a5093b4408d4d9d816ca6888213cc666744e",
    pubKey: "043c0e17d37606a34ddd57c115b6b54fba2728c70878543144700be350b2f6c5c427ec464af71222bddf41643758748757c66b51415feb78884bea86251763831e",
  };
};
