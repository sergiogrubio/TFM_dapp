import BigNumber from 'bignumber.js';
import {
  refreshAccount,
  transactionServices,
  useSignTransactions
  // useGetAccountInfo,
  // useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';

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

export const mySendTransaction = async (
  amount: number,
  dataTransaction: string,
  receiverAddress: string,
  msgProcess: string,
  msgError: string,
  msgSuccess: string
) => {
  console.log(amount, dataTransaction, receiverAddress);
  const { sendTransactions } = transactionServices;
  const transaction = {
    value: amount,
    data: dataTransaction,
    receiver: receiverAddress
  };

  await refreshAccount();

  const { sessionId, error } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: msgProcess,
      errorMessage: msgError,
      successMessage: msgSuccess
      // transactionDuration: 10000
    },
    redirectAfterSign: false
  });

  if (error != null) {
    console.log(error);
  }

  return { sessionId, error };
};
