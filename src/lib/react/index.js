export const render = (element, container) => {
  const dom = document.createTextNode('');
  dom.nodeValue = element.props.nodeValue;
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
