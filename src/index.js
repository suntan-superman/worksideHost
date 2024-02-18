import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider, UserContextProvider } from './contexts/ContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <UserContextProvider>
        {/* <CustomerContextProvider> */}
        <App />
        {/* </CustomerContextProvider> */}
      </UserContextProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
