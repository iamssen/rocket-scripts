import React, { useState } from 'react';

export function App({initialState}) {
  const [value, setValue] = useState(() => initialState.serverValue);
  
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