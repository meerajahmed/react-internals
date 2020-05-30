const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      // eslint-disable-next-line no-param-reassign
      nextState[key] = reducers[key](state[key], action);
      // nextState is local variable and its ok to reassign in this case because we are not mutating the original state.
      return nextState;
    }, {});
  };
};

export default combineReducers;
