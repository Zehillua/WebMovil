import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;