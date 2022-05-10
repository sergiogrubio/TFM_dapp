import React from 'react';
import { useState } from 'react';

import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Stats = () => {
  const [fundData, setFundData] = useState({
    token: '',
    amountToken: 0,
    amountEgld: 0
  });

  return (
    <>
      <div className='row'>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-secondary font-weight-bold float-right'>
            Num. tx:
          </div>
        </div>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-light'>data</div>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-secondary font-weight-bold float-right'>
            Elapsed time:
          </div>
        </div>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-light'>data</div>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-secondary font-weight-bold float-right'>
            tx/min:
          </div>
        </div>
        <div className='col-sm'>
          <div className='d-flex p-2 bg-light'>data</div>
        </div>
      </div>
    </>
  );
};

export default Stats;
