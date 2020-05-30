const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(
        (child) => (typeof child === 'object' ? child : createTextElement(child)) // if child is text element
      ),
    },
  };
};

const React = {
  createElement,
  createTextElement,
};

export default React;
