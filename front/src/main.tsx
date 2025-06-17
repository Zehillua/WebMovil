import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth0ProviderWithNavigate from './auth/auth0-provider';

// *** AÑADE ESTAS LÍNEAS ***
import './index.css'; // Importa tus estilos globales primero
import './App.css';  // Luego los estilos de App (si App.css tiene reglas generales)
// *************************

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);