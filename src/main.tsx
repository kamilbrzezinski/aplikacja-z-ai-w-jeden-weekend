import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/global.css';

const rootElement = document.querySelector('#root');

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('Nie znaleziono elementu głównego aplikacji.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
