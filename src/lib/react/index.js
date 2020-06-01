const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
// create react element
const createElement = (type, props, ...children /* children prop will always be an array */) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object'
          ? child
          : /* the child could also contain primitive -> string, number */
            createTextElement(child)
      ),
    },
  };
};

const React = {
  createElement,
  createTextElement,
};

export default React;
