import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {  BrowserRouter } from 'react-router-dom';

import App from './App';
import makeServer from './api/server';
import store from './store';

makeServer();

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);