export const render = (element, container) => {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);

  const isProperty = (key) => key !== 'children';

  Object.keys(element.props)
    .filter(isProperty) // filter children prop
    .forEach((name) => {
      /**
       * Add props like nodeValue
       */
      dom[name] = element.props[name];
    });

  if (element.props.children) {
    element.props.children.forEach((child) => render(child, dom)); // recursively render children
  }

  container.appendChild(dom);
};

export const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
    },
  };
};
