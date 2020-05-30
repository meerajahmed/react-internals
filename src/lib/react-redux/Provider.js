import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

function Provider(props) {
  const { store, children } = props;
  const contextValue = useMemo(() => {
    return {
      store,
    };
  }, [store]);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

Provider.defaultProps = {
  children: null,
};

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default Provider;
