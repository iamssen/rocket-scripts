import React, { useState } from 'react';
import { InitialState } from './data/initialState';

export function App({initialState}: {initialState?: InitialState}) {
  const [value, setValue] = useState(() => initialState ? initialState.serverValue : 'LOCAL VALUE');
  
  function updateValue() {
    setValue('CLIENT VALUE : ' + Date.now());
  }
  
  return (
    <div>
      <button onClick={updateValue}>
        {value}
      </button>
    </div>
  );
}