// eslint-disable-next-line import/prefer-default-export
export const render = (element, container) => {
  const dom = document.createTextNode('');
  dom.nodeValue = element.props.nodeValue;
  container.appendChild(dom);
};
