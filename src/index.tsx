import React from 'react';
import './assets/theme/base.css';
import './assets/theme/main.scss';
import App from './App';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { Provider } from 'react-redux';
import store from './redux/store';
import { msalConfig } from './core';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

export const msalInstance = new PublicClientApplication(msalConfig);

async function startApp() {
  // ✅ Initialize first
  await msalInstance.initialize();

  // ✅ Handle redirect login and token cache
  await msalInstance.handleRedirectPromise();

  // ✅ Restore active account
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
    console.log("Restored account:", accounts[0]);
  }

  // ✅ Render the React app
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </Provider>
    </React.StrictMode>
  );
}

startApp();
reportWebVitals();
