const createStore = (reducer, preloadedState) => {
  let state = preloadedState;
  let listeners = [];
  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  // init store
  dispatch({ type: '@@INIT' });

  return {
    getState,
    dispatch,
    subscribe,
  };
};

export default createStore;
