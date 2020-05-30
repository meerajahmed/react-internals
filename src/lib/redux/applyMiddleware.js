const applyMiddleware = (store, middlewares) => {
  // slice -> clone
  middlewares
    .slice()
    .reverse()
    .forEach((middleware) => {
      // eslint-disable-next-line no-param-reassign
      store.dispatch = middleware(store)(store.dispatch);
    });
};

export default applyMiddleware;
