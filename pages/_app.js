import '../styles/globals.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { WebSocket } from 'ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:3004/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3004/graphql',
  webSocketImpl: WebSocket, 
}));


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
export default function App({ Component, pageProps }) {
  return(
  <ApolloProvider client={client} >
   <Component {...pageProps} />
   </ApolloProvider>
  )
}
