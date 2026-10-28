import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root.jsx';
import { parseLocation } from './route.jsx';
import './fonts.css';
import './index.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <Root route={parseLocation(window.location)} />
  </React.StrictMode>
);

// Unaprijed iscrtana stranica (npm run build) se oživljava; u razvoju i pregledu se iscrtava iznova.
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);
