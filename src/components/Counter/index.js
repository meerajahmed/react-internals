import React from '../../lib/react';
import { useState } from '../../lib/react-dom';

const Counter = () => {
  const [state, setState] = useState(1);
  return (
    <button type="button" onClick={() => setState((c) => c + 1)}>
      <h1>Count: {state}</h1>
    </button>
  );
};

export default Counter;
