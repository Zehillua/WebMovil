import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const Auth0ProviderWithNavigate: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const domain = 'bhiem.us.auth0.com';      // ← Copiar desde Auth0
  const clientId = 'RGafPmzV8FosL5ZraqLB5FF2piQVcKe1';            // ← Copiar desde Auth0

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || '/');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
