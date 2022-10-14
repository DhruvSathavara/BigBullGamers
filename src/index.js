import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import * as serviceWorker from './serviceWorker';
import App from './App';

function Root() {
    return (
        <App />
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));
// serviceWorker.register();