// fetchers/FetcherRegistry.ts
import { BaseFetcher, DataSourceType } from './BaseFetcher';

export class FetcherRegistry {
  private static instance: FetcherRegistry;
  private fetchers: Map<string, BaseFetcher<any>>;

  private constructor() {
    this.fetchers = new Map();
  }

  public static getInstance(): FetcherRegistry {
    if (!FetcherRegistry.instance) {
      FetcherRegistry.instance = new FetcherRegistry();
    }
    return FetcherRegistry.instance;
  }

  public register(componentId: string, fetcher: BaseFetcher<any>): void {
    this.fetchers.set(componentId, fetcher);
  }

  public getFetcher(componentId: string): BaseFetcher<any> | undefined {
    return this.fetchers.get(componentId);
  }

  // Updated method to handle both client and server side URL construction
  public getDataUrl(componentId: string, dataSource: DataSourceType = 'json'): string {
    // For server-side fetching, we should return the full URL
    if (typeof window === 'undefined') {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/api/data?component=${componentId}&dataSource=${dataSource}`;
    }
    // For client-side, relative URL is fine
    return `/api/data?component=${componentId}&dataSource=${dataSource}`;
  }
}