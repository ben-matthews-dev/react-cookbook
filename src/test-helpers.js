import React from 'react';
import {render } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom";
import { Provider } from 'react-redux';

import App from './App';
import store from './store';

export default function visit(url) {
    return render(
        <MemoryRouter>
            <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
            </React.StrictMode>
        </MemoryRouter>
    );
}