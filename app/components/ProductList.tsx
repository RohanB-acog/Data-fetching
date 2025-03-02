// components/ProductList.tsx
'use client';

import React from 'react';
import { ListRenderer } from './ListRenderer';
import { Product } from '../fetchers/ProductDataFetcher';

interface ProductListProps {
  data?: Product[];
}

export function ProductList({ data = [] }: ProductListProps) {
  return (
    <ListRenderer
      data={data}
      title="Product List"
      renderItem={(product) => (
        <div className="product-card">
          <h3>{product.name}</h3>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Description: {product.description}</p>
          <p>ID: {product.id}</p>
        </div>
      )}
    />
  );
}
