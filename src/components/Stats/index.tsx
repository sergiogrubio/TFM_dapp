import React from 'react';

const Stats = () => {
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
