import React, { Fragment } from 'react';
import spinner from './spin1.gif';
const Spinner = () => {
  return (
    <div className='spinner'>
      <img
        src={spinner}
        style={{
          width: '80px',
          margin: 'auto',
          display: 'block',
          paddingBottom: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
        alt='Loading...'
      ></img>
      <h2 style={{ textAlign: 'center' }}>Loading your video...</h2>
    </div>
  );
};

export default Spinner;
