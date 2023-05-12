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
    from: "0x15375...b080f",
    to: "0x15379...b080f",
    balance: "0.268 ",
  },
  {
    from: "0x15379...b080f",
    to: "0x15375...b080f",
    balance: "0.278",
  },
  {
    from: "0x15379...b080f",
    to: "0x15375...b080f",
    balance: "0.278",
  },
  {
    from: "0x15379...b080f",
    to: "0x15375...b080f",
    balance: "0.278",
  },
  {
    from: "0x15379...b080f",
    to: "0x15375...b080f",
    balance: "0.278",
  },
  {
    from: "0x15379...b080f",
    to: "0x15375...b080f",
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
];
