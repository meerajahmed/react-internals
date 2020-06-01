import React from './lib/react';
import { render } from './lib/react-dom';

const container = document.getElementById('⚛️');
const element = (
  <div>
    <h1>
      <p>div &gt; h1 &gt; p</p>
      <span>div &gt; h1 &gt; span</span>
    </h1>
    <h2>div &gt; h2</h2>
  </div>
);
render(element, container);
