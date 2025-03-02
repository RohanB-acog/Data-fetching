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

  // This method will be called client-side and simply helps construct the API URL
  public getDataUrl(componentId: string, dataSource: DataSourceType = 'json'): string {
    return `/api/data?component=${componentId}&dataSource=${dataSource}`;
  }
}