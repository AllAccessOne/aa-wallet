import fcl from "@onflow/fcl";

export const sendTransaction = async (toAddress: string, amount: string) => {
  const transaction = fcl.transaction`
    import FlowToken from 0x7e60df042a9c0868

    transaction {
      prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&FlowToken.Vault{FlowToken.Balance}>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow reference to the vault")
        vaultRef.transfer(amount: ${amount}, to: ${toAddress})
      }
    }
  ` as any;

  const response = await fcl.send([transaction]);
  const { transactionId } = await fcl.decode(response);
  return transactionId;
};

export const sendTransactionFUSD = async (toAddress: string, amount: string) => {
  const transaction = fcl.transaction`
      import FungibleToken from 0x9a0766d93b6608b7
      import FUSD from 0xe223d8a629e49c68
  
      transaction {
        prepare(acct: AuthAccount) {
          let sender = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
              ?? panic("Could not borrow reference to FUSD Vault")
          let receiver = getAccount(${toAddress})
              .getCapability(/public/fusdReceiver)
              .borrow<&FUSD.Vault{FungibleToken.Receiver}>()
              ?? panic("Could not borrow receiver reference")
  
          sender.transfer(to: receiver, amount: ${amount})
        }
      }
    ` as any;

  const response = await fcl.send([transaction]);
  const { transactionId } = await fcl.decode(response);
  return transactionId;
};
