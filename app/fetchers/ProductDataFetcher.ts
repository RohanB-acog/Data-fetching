// fetchers/ProductDataFetcher.ts
import { BaseFetcher, DataSourceType } from "./BaseFetcher";

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
        id: typeof product.id === 'number' ? product.id : parseInt(product.id) || 0,
        name: product.name || 'Unknown Product',
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
        description: product.description || 'No description'
      }));
    }
    
    if (data.products && Array.isArray(data.products)) {
      return data.products.map((product: any) => ({
        id: typeof product.id === 'number' ? product.id : parseInt(product.id) || 0,
        name: product.name || 'Unknown Product',
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
        description: product.description || 'No description'
      }));
    }
    
    return [];
  }
}