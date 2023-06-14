import fcl, { t } from "@onflow/fcl";

export const getBalance = async (address: string) => {
  const script = fcl.script`
    import FlowToken from 0x7e60df042a9c0868

    pub fun main(address: Address): UFix64 {
      let acct = getAccount(address)
      let vaultRef = acct.getCapability(FlowToken.Balance.PublicPath).borrow<&FlowToken.Vault{FlowToken.Balance}>().unwrap()
      return vaultRef.balance
    }
  `;
  const response = await fcl.send([script, fcl.args([fcl.arg(address, t.Address)])]);
  const balance = await fcl.decode(response);
  console.log(balance);
  return balance;
};

export const getBalanceFUSD = async (address: string) => {
  const script = fcl.script`
  import FungibleToken from 0x9a0766d93b6608b7
  import FUSD from 0xe223d8a629e49c68

  pub fun main(address: Address): UFix64 {
    let acct = getAccount(address)
    let vaultRef = acct.getCapability<&{FungibleToken.Balance}>(FUSD.Balance.PublicPath).borrow()
        ?? panic("Could not borrow FUSD balance reference")
    return vaultRef.balance
  }
  `;
  const response = await fcl.send([script, fcl.args([fcl.arg(address, t.Address)])]);
  const balance = await fcl.decode(response);
  return balance;
};
