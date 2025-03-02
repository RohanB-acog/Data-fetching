import { BaseFetcher, DataSourceType } from "./BaseFetcher";

// fetchers/ProductDataFetcher.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
  }
  
  export class ProductDataFetcher extends BaseFetcher<Product> {
    constructor(dataSource: DataSourceType = 'json') {
      super({
        componentId: 'ProductData',
        dataSource,
        endpoint: dataSource === 'api' ? 'https://api.example.com/products' : undefined
      });
    }
  
    parseData(data: any): Product[] {
      // Handle different data structures based on source
      if (Array.isArray(data)) {
        return data.map(product => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          price: parseFloat(product.price) || 0,
          description: product.description || 'No description'
        }));
      }
      
      if (data.products && Array.isArray(data.products)) {
        return data.products.map((product: any) => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          price: parseFloat(product.price) || 0,
          description: product.description || 'No description'
        }));
      }
      
      return [];
    }
  }