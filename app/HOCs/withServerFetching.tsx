// hoc/withServerFetching.tsx

import React from 'react';
import { BaseFetcher } from '../fetchers/BaseFetcher';
import { FetcherRegistry } from '../fetchers/FetcherRegistry';

export function withServerFetching<T, P extends { data?: T[] }>(
  WrappedComponent: React.ComponentType<P>,
  componentId: string
) {
  return function WithServerFetching(props: Omit<P, 'data'>) {
    const [data, setData] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      const registry = FetcherRegistry.getInstance();
      const fetcher = registry.getFetcher(componentId);

      if (!fetcher) {
        setError(`No fetcher registered for component: ${componentId}`);
        setLoading(false);
        return;
      }

      // Fetch data from the server
      fetcher.fetchData(true)
        .then(result => {
          setData(result);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }, [componentId]);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;

    return <WrappedComponent {...(props as P)} data={data} />;
  };
}