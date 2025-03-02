// components/ListRenderer.tsx
'use client';

import React from 'react';
import { User } from '../fetchers/UserDataFetcher';
import { Product } from '../fetchers/ProductDataFetcher';

interface ListRendererProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title: string;
}

export function ListRenderer<T>({ data, renderItem, title }: ListRendererProps<T>) {
  return (
    <div className="list-container">
      <h2>{title}</h2>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul className="list">
          {data.map((item, index) => (
            <li key={index} className="list-item">
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}