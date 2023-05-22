const sliceAddress = (str: string) => {
  if (str.length > 35) {
    return str.substr(0, 8) + "..." + str.substr(str.length - 5, str.length);
  }
  return str;
};
const copyAddress = (address: string) => {
  navigator.clipboard.writeText(address);
};

export { sliceAddress, copyAddress };
