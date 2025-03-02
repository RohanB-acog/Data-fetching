// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Toggle } from './components/Toggle';
import { UserList } from './components/UserList';
import { ProductList } from './components/ProductList';
import { withServerFetching } from './HOCs/withServerFetching';
import { withClientFetching } from './HOCs/withClientFetching';
import { FetcherRegistry } from './fetchers/FetcherRegistry';
import { UserDataFetcher } from './fetchers/UserDataFetcher';
import { ProductDataFetcher } from './fetchers/ProductDataFetcher';
import { DataSourceType } from './fetchers/BaseFetcher';

// Create server and client components
const ServerUserList = withServerFetching(UserList, 'UserData');
const ClientUserList = withClientFetching(UserList, 'UserData');
const ServerProductList = withServerFetching(ProductList, 'ProductData');
const ClientProductList = withClientFetching(ProductList, 'ProductData');

export default function Home() {
  const [isServer, setIsServer] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataSourceType>('json');
  
  // Register fetchers when component mounts
  useEffect(() => {
    const registry = FetcherRegistry.getInstance();
    registry.register('UserData', new UserDataFetcher(dataSource));
    registry.register('ProductData', new ProductDataFetcher(dataSource));
  }, [dataSource]);

  const handleToggleMode = (server: boolean) => {
    setIsServer(server);
  };

  const handleChangeDataSource = (source: DataSourceType) => {
    setDataSource(source);
  };

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
            <ServerUserList />
            <ServerProductList />
          </>
        ) : (
          <>
            <ClientUserList />
            <ClientProductList />
          </>
        )}
      </div>
    </main>
  );
}
