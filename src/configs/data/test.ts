export const myListCoin: Array<Coin> = [
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.00001",
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
    name: "Ethereum",
    symbol: "ETH",
    balance: "0.04",
  },
  {
    img: "https://static.crypto.com/token/icons/tether/color_icon.png",
    name: "Tether",
    symbol: "USDT",
    balance: "10",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_A68qScBa0ZMqmvO3cFGFFabhRRxxxfNyLA&usqp=CAU",
    name: "Polkadot",
    symbol: "DOT",
    balance: "0.2",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png",
    name: "Binance Coin",
    symbol: "BNB",
    balance: "1.1",
  },
];

export const historyData: Array<History> = [
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    balance: "0.268 ",
  },
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    balance: "0.278",
  },
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    balance: "0.278",
  },
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    balance: "0.278",
  },
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    balance: "0.278",
  },
  {
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    balance: "0.278",
  },
];

type Coin = {
  img: string;
  name: string;
  symbol: string;
  balance: string;
};

type History = {
  from: string;
  to: string;
  balance: string;
};

type Device = {
  name: string;
  ip: string;
  id: string;
};
export const Devices: Array<Device> = [
  {
    name: "Chrome V11.1",
    ip: "123.456.789.101",
    id: "2404",
  },
  {
    name: "Chrome V11.1",
    ip: "123.456.789.101",
    id: "2404",
  },
  {
    name: "Apple",
    ip: "123.456.789.101",
    id: "2404",
  },
];

export interface Row {
  time: string;
  method: string;
  amount: number;
  from: string;
  to: string;
  network: string;
  id: string;
  token: string;
}

export const rows: Row[] = [
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be75111111111111111111",
  },
  {
    time: "2022-08-14 02:34",
    method: "Execute",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be222222222222222222222",
  },
  {
    time: "2022-08-14 02:34",
    method: "Transfer",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4433333333333333333333333333",
  },
  {
    time: "2022-08-14 02:34",
    method: "Linear Deposit",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c44444444444444444444444444",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9be5c6ce10ff1e4c7a555555555555555555555555555",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10f4c6666666666666666666666666666",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7777777777777777777777777",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6cef1e888888888888888888888888888888",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: 244.68,
    token: "USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce109999999999999999999999999999999",
  },
];
