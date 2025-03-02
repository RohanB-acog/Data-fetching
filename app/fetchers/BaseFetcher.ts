// fetchers/BaseFetcher.ts
import { FetcherRegistry } from './FetcherRegistry';

export type DataSourceType = 'json' | 'csv' | 'txt' | 'api';

export interface FetcherOptions {
  dataSource?: DataSourceType;
  componentId: string;
  endpoint?: string;
}

export abstract class BaseFetcher<T> {
  protected options: FetcherOptions;
  protected baseServerUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  protected baseClientUrl: string = '';

  constructor(options: FetcherOptions) {
    this.options = options;
  }

  abstract parseData(data: any): T[];

  private getUrl(isServer: boolean): string {
    // If using a specific endpoint (like external API)
    if (this.options.endpoint && this.options.dataSource === 'api') {
      return this.options.endpoint;
    }
    
    // If using the unified API endpoint
    const base = isServer ? this.baseServerUrl : this.baseClientUrl;
    const registry = FetcherRegistry.getInstance();
    const apiPath = registry.getDataUrl(this.options.componentId, this.options.dataSource);
    
    return `${base}${apiPath}`;
  }

  async fetchJsonData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.parseData(data);
  }

  async fetchCsvData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
    }
    
    const text = await response.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    const jsonData = rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {} as any);
    });
    
    return this.parseData(jsonData);
  }

  async fetchTxtData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch TXT data: ${response.statusText}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Simple format: assume each line is a JSON object
    const jsonData = lines
      .filter(line => line.trim() !== '')
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          // Simple key-value format
          const pairs = line.split(',');
          return pairs.reduce((obj, pair) => {
            const [key, value] = pair.split(':').map(s => s.trim());
            obj[key] = value;
            return obj;
          }, {} as any);
        }
      });
    
    return this.parseData(jsonData);
  }

  async fetchApiData(isServer: boolean): Promise<T[]> {
    // For external API calls (like RapidAPI)
    const url = this.options.endpoint || '';
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch API data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.parseData(data);
  }

  async fetchData(isServer: boolean = false): Promise<T[]> {
    const dataSource = this.options.dataSource || 'json';
    
    switch (dataSource) {
      case 'json':
        return this.fetchJsonData(isServer);
      case 'csv':
        return this.fetchCsvData(isServer);
      case 'txt':
        return this.fetchTxtData(isServer);
      case 'api':
        return this.fetchApiData(isServer);
      default:
        throw new Error(`Unsupported data source: ${dataSource}`);
    }
  }
}