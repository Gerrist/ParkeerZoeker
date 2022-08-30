import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import Root from './views/Root';
import reportWebVitals from './reportWebVitals';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
