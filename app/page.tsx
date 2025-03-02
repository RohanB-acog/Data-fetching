// app/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Toggle } from './components/Toggle';
import { UserList } from './components/UserList';
import { ProductList } from './components/ProductList';
import { withServerFetching } from './HOCs/withServerFetching';
import { withClientFetching } from './HOCs/withClientFetching';
import { FetcherRegistry } from './fetchers/FetcherRegistry';
import { UserDataFetcher } from './fetchers/UserDataFetcher';
import { ProductDataFetcher } from './fetchers/ProductDataFetcher';
import { DataSourceType } from './fetchers/BaseFetcher';

export default function Home() {
  const [isServer, setIsServer] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataSourceType>('json');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  // Initialize fetchers on component mount
  useEffect(() => {
    const registry = FetcherRegistry.getInstance();
    registry.register('UserData', new UserDataFetcher(dataSource));
    registry.register('ProductData', new ProductDataFetcher(dataSource));
    setIsInitialized(true);
  }, []);

  // Update fetchers when dataSource changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const registry = FetcherRegistry.getInstance();
    registry.register('UserData', new UserDataFetcher(dataSource));
    registry.register('ProductData', new ProductDataFetcher(dataSource));
    
    // Force re-render of components by updating the key
    setKey(prevKey => prevKey + 1);
  }, [dataSource, isInitialized]);

  const handleToggleMode = useCallback((server: boolean) => {
    setIsServer(server);
    // Force re-render when toggling between client and server
    setKey(prevKey => prevKey + 1);
  }, []);

  const handleChangeDataSource = useCallback((source: DataSourceType) => {
    setDataSource(source);
    // The re-render will be triggered by the useEffect above
  }, []);

  // Only render content after initialization
  if (!isInitialized) {
    return <div>Initializing data fetchers...</div>;
  }

  // Create components with the current key to force re-creation when needed
  const ServerUserList = withServerFetching(UserList, 'UserData');
  const ClientUserList = withClientFetching(UserList, 'UserData');
  const ServerProductList = withServerFetching(ProductList, 'ProductData');
  const ClientProductList = withClientFetching(ProductList, 'ProductData');

  return (
    <main className="container">
      <h1>Next.js Data Fetching System</h1>
      
      <Toggle 
        onToggleMode={handleToggleMode}
        onChangeDataSource={handleChangeDataSource}
        isServer={isServer}
        dataSource={dataSource}
      />
      
      <div className="content">
        {isServer ? (
          <>
            <ServerUserList key={`server-user-${key}`} />
            <ServerProductList key={`server-product-${key}`} />
          </>
        ) : (
          <>
            <ClientUserList key={`client-user-${key}`} />
            <ClientProductList key={`client-product-${key}`} />
          </>
        )}
      </div>
    </main>
  );
}