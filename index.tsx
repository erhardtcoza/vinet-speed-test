
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This check ensures that the DOM-related code only runs in a browser environment,
// preventing errors during the Cloudflare deployment process which may execute code
// in a non-browser context.
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
