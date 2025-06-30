import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// ✅ AUTH LINK PARA AGREGAR TOKEN
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// ✅ SIMPLE - UN SOLO LINK PARA PEDIDOS
const httpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql', // Solo pedidos por ahora
});

// ✅ CLIENTE APOLLO SIMPLE
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
  },
});

export default client;