import { createElement, createTextElement, render } from './lib/react';

/**
 * React text element
 */
const textEl = createTextElement('Hello World');
const htmlEl = createElement('h1', undefined, textEl);

const container = document.getElementById('⚛️');
render(htmlEl, container);
