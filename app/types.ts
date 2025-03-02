// app/types.ts
export type DataSourceType = 'json' | 'csv' | 'txt' | 'api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}