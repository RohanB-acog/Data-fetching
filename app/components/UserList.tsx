// components/UserList.tsx
'use client';

import React from 'react';
import { ListRenderer } from './ListRenderer';
import { User } from '../fetchers/UserDataFetcher';

interface UserListProps {
  data?: User[];
}

export function UserList({ data = [] }: UserListProps) {
  return (
    <ListRenderer
      data={data}
      title="User List"
      renderItem={(user) => (
        <div className="user-card">
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      )}
    />
  );
}