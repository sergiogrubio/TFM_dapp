import { contractAddress } from '../config';
import { BigNumber } from 'bignumber.js';
import {
  Address,
  ContractFunction,
  U32Value,
  U64Value,
  Balance,
  Code,
  SmartContract,
  GasLimit,
  CodeMetadata,
  BytesValue,
  BigUIntValue,
  BooleanValue
} from '@elrondnetwork/erdjs';
import { hexEncodeStr, hexEncodeNumber } from './common';
// Create first piggy bank, you can have only one for now
// Pass unix timestamp in the future, this is the lock time
export const addLiquidityToken = (token: string, amount: string) => {
  const contract = new SmartContract({
    address: new Address(contractAddress)
  });

  return contract.call({
    func: new ContractFunction('addLiquidityToken'),
    args: [BytesValue.fromUTF8(token), new U32Value(Number(amount))],
    gasLimit: new GasLimit(60000000)
  });
};
