import React from 'react';
import { useState } from 'react';

import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormTrade = () => {
  const [fundData, setFundData] = useState({
    token: '',
    amountToken: 0,
    amountEgld: 0
  });

  return (
    <>
      <form className=''>
        <div className='form-group row'>
          <label htmlFor='token' className=''>
            Select pair:
          </label>
          <select className='form-control' id='token' name='token'>
            <option value='MHP-737aa1'>xEGLD-MHP</option>
            <option value='SGR-07dffb'>xEGLD-SGR</option>
            <option value='UOC-d139bb'>xEGLD-UOC</option>
            <option value='WEB-5d08be'>xEGLD-WEB</option>
          </select>
        </div>
        <div className='form-group row'>
          <label htmlFor='amountToken' className=''>
            Amount (xxx):
          </label>
          <input
            className='form-control'
            type='number'
            placeholder='x1000000'
            step='1000000'
            min='0'
            max='100000000000000000000'
            id='amountToken'
            name='amountToken'
          />
          <label htmlFor='amountToken' className='text-info'>
            Price: 1 XXX - 1212 YYY
          </label>
        </div>
        <button className='btn bg-white m-2'>
          <FontAwesomeIcon icon={faArrowDown} className='text-primary' />
          Buy
        </button>
        <button className='btn bg-white m-2'>
          <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
          Sell
        </button>
      </form>
    </>
  );
};

export default FormTrade;
