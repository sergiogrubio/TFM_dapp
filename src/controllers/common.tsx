import BigNumber from 'bignumber.js';
// idea from:
// https://github.com/bogdan-rosianu/elrond-converters
export const hexEncodeStr = (str: string) =>
  Buffer.from(str, 'ascii').toString('hex');

// idea from:
// https://github.com/bogdan-rosianu/elrond-converters
export const hexEncodeNumber = (num: number) => {
  const bn = new BigNumber(num, 10);
  let bnStr = bn.toString(16);

  if (bnStr.length % 2 != 0) {
    bnStr = '0' + bnStr;
  }

  return bnStr;
};

// idea from:
// https://github.com/bogdan-rosianu/elrond-converters
export const hexDecodeNumber = (num: string) => {
  const bn = new BigNumber(num, 16);
  const bnDec = bn.toString(10);

  return bnDec;
};

export function capitalize(str: string) {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}
