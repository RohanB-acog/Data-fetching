// hoc/withClientFetching.tsx
'use client';

import React from 'react';
import { BaseFetcher } from '../fetchers/BaseFetcher';
import { FetcherRegistry } from '../fetchers/FetcherRegistry';
import { DataSourceType } from '../fetchers/BaseFetcher';

export function withClientFetching<T, P extends { data?: T[] }>(
  WrappedComponent: React.ComponentType<P>,
  componentId: string,
  dataSource: DataSourceType = 'json'
) {
  return function WithClientFetching(props: Omit<P, 'data'>) {
    const [data, setData] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const registry = FetcherRegistry.getInstance();
          const fetcher = registry.getFetcher(componentId);

          if (!fetcher) {
            throw new Error(`No fetcher registered for component: ${componentId}`);
          }

          // Fetch data from the client
          const result = await fetcher.fetchData(false);
          setData(result);
        } catch (err: any) {
          console.error("Client fetching error:", err);
          setError(err.message || 'Unknown error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [componentId]);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;

    return <WrappedComponent {...(props as P)} data={data} />;
  };
}