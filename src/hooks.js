/* eslint-disable react/no-deprecated */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

// TODO: refactor code

const React = (function React() {
  const hooks = [];
  let index = 0;
  const useState = (initialState) => {
    const state = hooks[index] || initialState;
    const currIndex = index;
    const setState = (newValue) => {
      hooks[currIndex] = newValue;
    };
    index += 1;
    return [state, setState];
  };

  const useEffect = (cb, depArray) => {
    let hasChanged = true;
    const oldDepArray = hooks[index];
    if (oldDepArray) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDepArray[i]));
    }
    if (hasChanged) {
      cb();
    }
    hooks[index] = depArray;
    index += 1;
  };

  const render = (Component) => {
    index = 0;
    const instance = Component();
    instance.render();
    return instance;
  };

  return {
    useState,
    useEffect,
    render,
  };
})();

const Component = () => {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('Apple');
  React.useEffect(() => console.log('useEffect called'), [text]);
  return {
    render: () => console.log(count, text),
    click: () => setCount(count + 1),
    type: (word) => setText(word),
  };
};

let App = React.render(Component);
App.click();
App = React.render(Component);
App.type('Pear');
App = React.render(Component);
