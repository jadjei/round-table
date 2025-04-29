// src/hooks/useBlockfrostGraphQL.ts
import { useState, useEffect, useContext } from 'react';
import { ConfigContext } from '../cardano/config';

interface GraphQLOptions {
  query: string;
  variables?: Record<string, any>;
  skip?: boolean;
  pollInterval?: number;
}

interface GraphQLResult<T> {
  data?: T;
  loading: boolean;
  error?: Error;
  refetch: () => Promise<T | undefined>;
}

export function useBlockfrostGraphQL<T>(options: GraphQLOptions): GraphQLResult<T> {
  const [config] = useContext(ConfigContext);
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  
  const { query, variables, skip = false, pollInterval } = options;
  const isBlockfrost = config.queryAPI.URI.includes('blockfrost.io');
  const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || '';

  const fetchData = async (): Promise<T | undefined> => {
    if (skip) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(undefined);

    try {
      // For Blockfrost requests, either use our proxy or direct with headers
      let response;
      if (isBlockfrost) {
        // Option 1: Use our custom proxy to avoid CORS
        const encodedTarget = encodeURIComponent(config.queryAPI.URI);
        response = await fetch(`/api/proxy?target=${encodedTarget}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables })
        });
      } else {
        // For non-Blockfrost endpoints
        response = await fetch(config.queryAPI.URI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables })
        });
      }

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(', '));
      }

      setData(result.data);
      setLoading(false);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      console.error('GraphQL fetch error:', error);
      return undefined;
    }
  };

  useEffect(() => {
    fetchData();

    if (pollInterval) {
      const interval = setInterval(() => {
        fetchData();
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [query, JSON.stringify(variables), skip, config.queryAPI.URI]);

  return {
    data,
    loading, 
    error,
    refetch: fetchData
  };
}
