/*
 * mental model: function with several arguments that are applied as they become available
 * */
const logger = (store) => (next) => {
  /* eslint-disable no-console */
  if (!console.group) {
    return next;
  }
  return (action) => {
    console.group(action.type);
    console.log('%c prev state', 'color:grey', store.getState());
    console.log('%c action', 'color:blue', action);
    next(action);
    console.log('%c next state', 'color:green', store.getState());
    console.groupEnd();
  };
  /* eslint-enable no-console */
};
export default logger;
