import React from 'react';

import arrowDown from '../../images/arrow-down.svg';

export default function Paginate(props) {
  return (
    <div className='d-flex align-self-center'>
      <img
        onClick={props.handleClickPrePage}
        className='rotate-left cursor-hover'
        src={arrowDown}
        alt='arrow-left'
      />
      <input
        type='number'
        name='page'
        value={props.page}
        onChange={(e) => props.handleChangePage(e.target.value)}
        style={{ border: 'none', width: '30px', textAlign: 'right', marginTop: '-1px' }}
      />/{props.data && props.data.count ? Math.ceil(props.data.count / props.limit) : '1'}
      <img
        onClick={props.handleClickNextPage}
        className='rotate-right cursor-hover ms-3'
        src={arrowDown}
        alt='arrow-right'
      />
    </div>
  )
}
