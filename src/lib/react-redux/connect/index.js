import React, { PureComponent } from 'react';
import { ReactReduxContext } from '../Context';

const connect = (mapStateToProps, mapDispatchToProps = (dispatch) => ({ dispatch })) => (
  Component
) => {
  const shouldHandleStateChanges = Boolean(mapStateToProps);

  class Wrapper extends PureComponent {
    componentDidMount() {
      const { store } = this.context;
      if (shouldHandleStateChanges) {
        this.unsubscribe = store.subscribe(() => {
          this.forceUpdate();
        });
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    getMappedProps = () => {
      const { store } = this.context;
      const state = store.getState();
      if (shouldHandleStateChanges) {
        return {
          ...this.props,
          ...mapStateToProps(state, this.props),
          ...mapDispatchToProps(store.dispatch, this.props),
        };
      }
      return {
        ...this.props,
        ...mapDispatchToProps(store.dispatch, this.props),
      };
    };

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...this.getMappedProps()} />;
    }
  }
  Wrapper.contextType = ReactReduxContext;
  Wrapper.displayName = `connect(${Component.displayName || Component.name})`;
  return Wrapper;
};

export default connect;
