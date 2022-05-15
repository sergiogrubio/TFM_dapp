import { refreshAccount, transactionServices } from '@elrondnetwork/dapp-core';
import {
  Address,
  BytesValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { hexEncodeStr, hexDecodeNumber } from './common';

export class CustomNetworkProvider extends ApiNetworkProvider {
  async getTokens(address: string) {
    return await this.doGetGeneric(`accounts/${address}/tokens`);
  }
}

// TODO: change any for interface
export const genericTransactions = async (pTransactions: any[]) => {
  const { sendTransactions } = transactionServices;

  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: pTransactions,
    redirectAfterSign: false
  });

  return sessionId;
};

export const genericQuery = async (
  pAddress: string,
  pNetwork: any,
  pFunction: string,
  pToken: string,
  setter: any
) => {
  const query = new Query({
    address: new Address(pAddress),
    func: new ContractFunction(pFunction),
    args: [BytesValue.fromHex(hexEncodeStr(pToken))]
  });
  const proxy = new ProxyProvider(pNetwork.apiAddress);
  proxy
    .queryContract(query)
    .then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, 'base64').toString('hex');
      const decNumber = hexDecodeNumber(decoded);
      // console.log(decNumber);
      if (decNumber === '') {
        setter('0');
      } else {
        setter(decNumber);
      }
    })
    .catch((err) => {
      console.error('Unable to call VM query', err);
    });
};
