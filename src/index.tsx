import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
// NOTE: we avoid importing the entire bootstrap-icons font CSS to keep bundle size smaller.
// Icons are embedded inline where needed using SVG markup from the installed package.

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
