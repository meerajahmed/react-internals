import { createContext } from 'react';

export const ReactReduxContext = createContext(null);

if (__DEV__) {
  ReactReduxContext.displayName = 'ReactRedux';
}

export default ReactReduxContext;
