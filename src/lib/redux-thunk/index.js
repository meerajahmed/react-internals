const thunk = (store) => (next) => (action) =>
  typeof action === 'function'
    ? /* thunks can dispatch both plain object actions and
     other thunks hence pass store.dispatch instead of calling next middleware */ action(
        store.dispatch,
        store.getState
      )
    : /* else pass action to next middleware in chain */ next(action);

export default thunk;
