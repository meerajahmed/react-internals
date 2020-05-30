import { createTextElement, render } from './lib/react';

/**
 * React text element
 */
const textEl = createTextElement('Hello World');
const htmlEl = {
  type: 'h1',
  props: {
    children: [textEl],
  },
};

const container = document.getElementById('⚛️');
render(htmlEl, container);
