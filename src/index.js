import { render } from './lib/react';

/**
 * React text element
 */
const textEl = {
  type: 'TEXT_ELEMENT',
  props: {
    nodeValue: 'Hello World',
  },
};

const container = document.getElementById('⚛️');
render(textEl, container);
