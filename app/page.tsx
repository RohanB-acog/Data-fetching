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
  const [key, setKey] = useState<number>(0); // Add a key to force re-render

  // Create dynamic server and client components based on current key
  const ServerUserList = withServerFetching(UserList, 'UserData');
  const ClientUserList = withClientFetching(UserList, 'UserData');
  const ServerProductList = withServerFetching(ProductList, 'ProductData');
  const ClientProductList = withClientFetching(ProductList, 'ProductData');
  
  // Register fetchers when dataSource changes
  useEffect(() => {
    const registry = FetcherRegistry.getInstance();
    registry.register('UserData', new UserDataFetcher(dataSource));
    registry.register('ProductData', new ProductDataFetcher(dataSource));
    
    // Force re-render of components by updating the key
    setKey(prevKey => prevKey + 1);
  }, [dataSource]);

  const handleToggleMode = useCallback((server: boolean) => {
    setIsServer(server);
    // Force re-render when toggling between client and server
    setKey(prevKey => prevKey + 1);
  }, []);

  const handleChangeDataSource = useCallback((source: DataSourceType) => {
    setDataSource(source);
    // The re-render will be triggered by the useEffect above
  }, []);

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