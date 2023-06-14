declare const fcl: {
  config: () => any;
  send: (args: any) => Promise<any>;
  transaction: (args: any) => any;
  proposer: (args: any) => any;
  payer: (args: any) => any;
  authorizations: (args: any) => any;
  limit: (args: any) => any;
  currentUser: () => any;
  tx: (args: any) => any;
};

declare const AuthAccount: any;
