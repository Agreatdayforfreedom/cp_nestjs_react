import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import { createClient } from 'graphql-ws';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  concat,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { Provider } from 'react-redux';
import { store } from './app/store';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

let token = localStorage.getItem('token');
window.addEventListener('storage', () => {
  token = localStorage.getItem('token') || '';
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/subscriptions',
    connectionParams: {
      auth_token: token ? `Bearer ${token}` : '',
    },
  }),
);
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  concat(authMiddleware, httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache({}),
  link: splitLink,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
);
