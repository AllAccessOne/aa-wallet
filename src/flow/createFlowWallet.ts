import * as fcl from "@onflow/fcl";

const createFlowWallet = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
    import Accounts from 0x090f8a70ed0dca73
    transaction {
      prepare(signer: AuthAccount) {
        let account = AuthAccount(payer: signer)
        Accounts.store(account: account)
      }
    }
    `,
    limit: 50,
  });

  const transaction = await fcl.tx(transactionId).onceSealed();
  console.log(transaction); //
};
export default createFlowWallet;
