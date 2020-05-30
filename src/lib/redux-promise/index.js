const promise = () => (next) => (action) => {
  /*
   * Now, we can dispatch both actions and promises that resolve to actions
   * */
  if (typeof action.then === 'function') {
    /* Wait for the promise to resolve before dispatching the action */
    action.then(next);
  }
  next(action);
};

export default promise;
