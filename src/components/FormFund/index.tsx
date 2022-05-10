import React from 'react';
import { useState } from 'react';
import {
  transactionServices,
  // useGetAccountInfo,
  // useGetPendingTransactions,
  refreshAccount
} from '@elrondnetwork/dapp-core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contractAddress } from 'config';
import { hexEncodeStr, hexEncodeNumber } from '../../controllers/common';

const FormFund = () => {
  const [fundData, setFundData] = useState({
    token: 'SGR-07dffb', // put first element in the SELECT, is there a better way to do it?
    amountToken: 0,
    amountEgld: 0
  });
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const handleInputChange = (event: any) => {
    setFundData({
      ...fundData,
      [event.target.name]: event.target.value
    });
  };

  // const { hasPendingTransactions, pendingTransactionsArray } =
  //   useGetPendingTransactions();

  // console.log(hasPendingTransactions, pendingTransactionsArray);

  // const { address, account } = useGetAccountInfo();

  // const addLiquidityToken = async (token: string, amountToken: number) => {
  //   const { sendTransactions } = transactionServices;
  //   // it is possible to send multiple ESDT in a single transaction
  //   // https://stackoverflow.com/questions/70772762/how-to-send-egld-value-to-smart-contract-endpoint
  //   // Example:
  //   // MultiESDTNFTTransfer@Contract_address_in_hex@02@Token1Identifier_in_hex@Token1Nonce_in_hex
  //   // @Token1Value_in_hex@Token2Identifier_in_hex@Token2Nonce_in_hex@Token2Value_in_hex
  //   // @myEndpoint_in_hex
  //   // after trying almos everything I can't sent token + xEGLD to the smart contract
  //   // I've got erros such as:
  //   // - sending value to non payable contract
  //   // - built in function called with tx value is not allowed
  //   // I decide to send liquidity pool in two transactions
  //   // const data =
  //   //   'MultiESDTNFTTransfer' +
  //   //   '@' +
  //   //   contractAddress + // Contract_address_in_hex
  //   //   '@' + // number of tokens sended
  //   //   '02' +
  //   //   '@' + // Token1Identifier_in_hex
  //   //   hexEncodeStr(token) +
  //   //   '@00' + // Token1Nonce_in_hex
  //   //   '@' + // Token1Value_in_hex
  //   //   hexEncodeNumber(amountToken) +
  //   //   '@' +
  //   //   hexEncodeStr('xEGLD') +
  //   //   '@00' + // Token1Nonce_in_hex
  //   //   '@' + // Token1Value_in_hex
  //   //   hexEncodeNumber(amountEgld) +
  //   //   '@' +
  //   //   hexEncodeStr('addLiquidity'); // contractAddress; // Contract_address_in_hex

  //   const data =
  //     'ESDTTransfer' +
  //     '@' +
  //     hexEncodeStr(token) + // token identifier in hexadecimal encoding, UOC-d139bb
  //     '@' + // value to transfer in hexadecimal encoding, 52b7d2dcc80cd2e4000000=100000000000000000000000000
  //     hexEncodeNumber(amountToken) +
  //     '@' +
  //     hexEncodeStr('addLiquidityToken'); // name of method to call in hexadecimal encoding

  //   // data =
  //   //   'ESDTTransfer' +
  //   //   '@' + // Token1Identifier_in_hex
  //   //   hexEncodeStr(token) +
  //   //   '@' + // Token1Value_in_hex
  //   //   hexEncodeNumber(amountToken) +
  //   //   '@' +
  //   //   hexEncodeStr('addLiquidity');
  //   // transaction = {
  //   //   value: amountEgld,
  //   //   data,
  //   //   receiver: contractAddress
  //   // };

  //   const transaction = {
  //     value: 0,
  //     data,
  //     receiver: contractAddress
  //   };

  //   await refreshAccount();

  //   const { sessionId, error } = await sendTransactions({
  //     transactions: transaction,
  //     transactionsDisplayInfo: {
  //       processingMessage: 'Adding liquidity token',
  //       errorMessage: 'An error has occured (liq. token)',
  //       successMessage: 'Liquidity token added successfully'
  //     },
  //     redirectAfterSign: false
  //   });
  //   if (sessionId != null) {
  //     setTransactionSessionId(sessionId);
  //     console.log('log sessionId: ' + sessionId);
  //     console.log('error: ' + error);
  //   }

  //   return sessionId;
  // };

  // const addLiquidityEgld = async (token: string, amountEgld: number) => {
  //   const { sendTransactions } = transactionServices;
  //   const transaction = {
  //     value: amountEgld,
  //     data: 'addLiquidityEgld' + '@' + hexEncodeStr(token),
  //     receiver: contractAddress
  //   };

  //   await refreshAccount();

  //   const { sessionId /*, error*/ } = await sendTransactions({
  //     transactions: transaction,
  //     transactionsDisplayInfo: {
  //       processingMessage: 'Adding liquidity EGLD',
  //       errorMessage: 'An error has occured (liq. EGLD)',
  //       successMessage: 'Liquidity EGLD added successfully'
  //     },
  //     redirectAfterSign: false
  //   });
  //   if (sessionId != null) {
  //     setTransactionSessionId(sessionId);
  //   }
  // };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // const { sendTransactions } = transactionServices;

    const token = fundData.token;
    const amountToken = fundData.amountToken;
    const amountEgld = fundData.amountEgld;

    // const dataToken =
    //   'ESDTTransfer' +
    //   '@' +
    //   hexEncodeStr(token) + // token identifier in hexadecimal encoding, UOC-d139bb
    //   '@' + // value to transfer in hexadecimal encoding, 52b7d2dcc80cd2e4000000=100000000000000000000000000
    //   hexEncodeNumber(amountToken) +
    //   '@' +
    //   hexEncodeStr('addLiquidityToken'); // name of method to call in hexadecimal encoding

    // const dataEgld = 'addLiquidityEgld' + '@' + hexEncodeStr(token);

    // const transactionToken = {
    //   value: 0,
    //   dataToken,
    //   receiver: contractAddress
    // };

    // const transactionEgld = {
    //   value: amountEgld,
    //   data: dataEgld,
    //   receiver: contractAddress
    // };

    // await refreshAccount();

    // // this king of structure doesn't work, use an array of transactions
    // // const resultEgld = await addLiquidityEgld(token, amountEgld);
    // // console.log(resultEgld);

    // // if (resultEgld != null) {
    // //   const resultToken = await addLiquidityToken(token, amountToken);
    // //   console.log(resultToken);
    // // }

    // const { sessionId, error } = await sendTransactions({
    //   transactions: transactionToken,
    //   transactionsDisplayInfo: {
    //     processingMessage: 'Adding liquidity',
    //     errorMessage: 'An error has occured',
    //     successMessage: 'Liquidity added successfully'
    //   },
    //   redirectAfterSign: false
    // });
    // if (sessionId != null) {
    //   setTransactionSessionId(sessionId);
    //   console.log('log sessionId: ' + sessionId);
    //   console.log('error: ' + error);
    // }

    // return sessionId;

    const { sendTransactions } = transactionServices;
    // it is possible to send multiple ESDT in a single transaction
    // https://stackoverflow.com/questions/70772762/how-to-send-egld-value-to-smart-contract-endpoint
    // Example:
    // MultiESDTNFTTransfer@Contract_address_in_hex@02@Token1Identifier_in_hex@Token1Nonce_in_hex
    // @Token1Value_in_hex@Token2Identifier_in_hex@Token2Nonce_in_hex@Token2Value_in_hex
    // @myEndpoint_in_hex
    // after trying almos everything I can't sent token + xEGLD to the smart contract
    // I've got erros such as:
    // - sending value to non payable contract
    // - built in function called with tx value is not allowed
    // I decide to send liquidity pool in two transactions
    // const data =
    //   'MultiESDTNFTTransfer' +
    //   '@' +
    //   contractAddress + // Contract_address_in_hex
    //   '@' + // number of tokens sended
    //   '02' +
    //   '@' + // Token1Identifier_in_hex
    //   hexEncodeStr(token) +
    //   '@00' + // Token1Nonce_in_hex
    //   '@' + // Token1Value_in_hex
    //   hexEncodeNumber(amountToken) +
    //   '@' +
    //   hexEncodeStr('xEGLD') +
    //   '@00' + // Token1Nonce_in_hex
    //   '@' + // Token1Value_in_hex
    //   hexEncodeNumber(amountEgld) +
    //   '@' +
    //   hexEncodeStr('addLiquidity'); // contractAddress; // Contract_address_in_hex

    const data =
      'ESDTTransfer' +
      '@' +
      hexEncodeStr(token) + // token identifier in hexadecimal encoding, UOC-d139bb
      '@' + // value to transfer in hexadecimal encoding, 52b7d2dcc80cd2e4000000=100000000000000000000000000
      hexEncodeNumber(amountToken) +
      '@' +
      hexEncodeStr('addLiquidityToken'); // name of method to call in hexadecimal encoding

    // data =
    //   'ESDTTransfer' +
    //   '@' + // Token1Identifier_in_hex
    //   hexEncodeStr(token) +
    //   '@' + // Token1Value_in_hex
    //   hexEncodeNumber(amountToken) +
    //   '@' +
    //   hexEncodeStr('addLiquidity');
    // transaction = {
    //   value: amountEgld,
    //   data,
    //   receiver: contractAddress
    // };

    const transaction1 = {
      value: 0,
      data,
      receiver: contractAddress
    };

    const transaction2 = {
      value: amountEgld,
      data: 'addLiquidityEgld' + '@' + hexEncodeStr(token),
      receiver: contractAddress
    };

    await refreshAccount();

    const { sessionId, error } = await sendTransactions({
      transactions: [transaction2, transaction1],
      transactionsDisplayInfo: {
        processingMessage: 'Adding liquidity token',
        errorMessage: 'An error has occured (liq. token)',
        successMessage: 'Liquidity token added successfully'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      console.log('log sessionId: ' + sessionId);
      console.log('error: ' + error);
    }

    return sessionId;
  };

  return (
    <>
      <h4 className='mb-3 font-weight-normal text-light'>
        Fund liquidity pools
      </h4>
      <form className='' onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='token' className='text-light'>
            Select token:
          </label>
          <select
            className='form-control'
            id='token'
            name='token'
            onChange={handleInputChange}
          >
            <option value='SGR-07dffb'>SGR</option>
            <option value='UOC-d139bb'>UOC</option>
            <option value='WEB-5d08be'>WEB</option>
          </select>
        </div>
        <div className='form-group row'>
          <label htmlFor='amountToken' className='text-light'>
            Amount token:
          </label>
          <input
            className='form-control'
            type='number'
            placeholder='x1000000'
            step='1000000'
            min='0'
            max='100000000000000000000000000'
            id='amountToken'
            name='amountToken'
            onChange={handleInputChange}
          />
          <label htmlFor='amountToken' className='text-info'>
            Available:
          </label>
        </div>
        <div className='form-group row'>
          <label htmlFor='amountEgld' className='text-light'>
            Amount EGLD:
          </label>
          <input
            className='form-control'
            type='number'
            placeholder='x1000000'
            step='1000000'
            min='0'
            max='100000000000000000000000000'
            id='amountEgld'
            name='amountEgld'
            onChange={handleInputChange}
          />
          <label htmlFor='amountEgld' className='text-info'>
            Available:
          </label>
        </div>
        <div className='d-flex mt-4 justify-content-center'>
          <button className='btn bg-white m-2'>
            <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
            Fund
          </button>
        </div>
      </form>
    </>
  );
};

export default FormFund;
