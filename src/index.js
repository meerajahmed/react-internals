import { createTextElement, render } from './lib/react';

/**
 * React text element
 */
const textEl = createTextElement('Hello World');

const container = document.getElementById('⚛️');
render(textEl, container);
