import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { providerAddress } from 'config';
import { hexDecodeNumber } from './common';

export class CustomNetworkProvider extends ApiNetworkProvider {
  async getTokens(address: string) {
    return await this.doGetGeneric(`accounts/${address}/tokens`);
  }
  async getTokenData(address: string, token: string) {
    return await this.doGetGeneric(`accounts/${address}/tokens/${token}/`);
  }
}

export const getProvider = () => {
  return new CustomNetworkProvider(providerAddress, {
    timeout: 5000
  });
};

// TODO: change any for an interface
export const myTransactions = async (pTransactions: any[]) => {
  const { sendTransactions } = transactionServices;

  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: pTransactions,
    redirectAfterSign: false
  });

  return sessionId;
};

// export const genericQuery = async (
//   pAddress: string,
//   pNetwork: any,
//   pFunction: string,
//   pToken: string,
//   setter: any
// ) => {
//   const query = new Query({
//     address: new Address(pAddress),
//     func: new ContractFunction(pFunction),
//     args: [BytesValue.fromHex(hexEncodeStr(pToken))]
//   });
//   const proxy = new ProxyProvider(pNetwork.apiAddress);
//   proxy
//     .queryContract(query)
//     .then(({ returnData }) => {
//       const [encoded] = returnData;
//       const decoded = Buffer.from(encoded, 'base64').toString('hex');
//       const decNumber = hexDecodeNumber(decoded);
//       // console.log(decNumber);
//       if (decNumber === '') {
//         setter('0');
//       } else {
//         setter(decNumber);
//       }
//     })
//     .catch((err) => {
//       console.error('Unable to call VM query', err);
//     });
// };

export const myQuery = async (
  pAddress: string,
  pNetwork: any,
  pFunction: string,
  pArgs: any[]
) => {
  const query = new Query({
    address: new Address(pAddress),
    func: new ContractFunction(pFunction),
    args: pArgs
  });
  const proxy = new ProxyProvider(pNetwork.apiAddress);
  const result = proxy
    .queryContract(query)
    .then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, 'base64').toString('hex');
      const decNumber = hexDecodeNumber(decoded);

      if (decNumber === '') {
        return Promise.resolve('0');
      } else {
        return Promise.resolve(decNumber);
      }
    })
    .catch((err) => {
      console.error('Unable to call VM query', err);
      return Promise.resolve('');
    });
  return result;
};
