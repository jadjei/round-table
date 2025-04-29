// src/cardano/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';
import { Config } from './config';

// Create Apollo Client configured for Blockfrost or other GraphQL endpoints
export const createApolloClient = (config: Config) => {
  // Check if we're connecting to Blockfrost
  const isBlockfrost = config.queryAPI.URI.includes('blockfrost.io');
  
  // Create an HTTP link for the GraphQL server
  const httpLink = new HttpLink({
    uri: config.queryAPI.URI,
    fetch: (input, init) => {
      // If using Blockfrost, add the project_id header
      if (isBlockfrost && init) {
        init.headers = {
          ...init.headers,
          'project_id': process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || ''
        };
      }
      return fetch(input, init);
    }
  });

  // Create a middleware link to handle CORS for certain endpoints
  const corsMiddleware = new ApolloLink((operation, forward) => {
    // Add any required CORS handling
    return forward(operation);
  });

  // Return configured Apollo Client
  return new ApolloClient({
    link: concat(corsMiddleware, httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        PaymentAddress: {
          keyFields: ['address']
        }
      }
    })
  });
};
