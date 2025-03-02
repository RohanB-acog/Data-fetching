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

  constructor(options: FetcherOptions) {
    this.options = options;
  }

  abstract parseData(data: any): T[];

  private getUrl(isServer: boolean): string {
    // If using a specific endpoint (like external API)
    if (this.options.endpoint && this.options.dataSource === 'api') {
      return this.options.endpoint;
    }
    
    // Use the registry to get the correct URL format
    const registry = FetcherRegistry.getInstance();
    return registry.getDataUrl(this.options.componentId, this.options.dataSource);
  }

  async fetchJsonData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    try {
      const response = await fetch(url, {
        // Add cache: 'no-store' to prevent caching issues when switching sources
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.parseData(data);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      throw error;
    }
  }

  async fetchCsvData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    try {
      const response = await fetch(url, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
      }
      
      const text = await response.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      const jsonData = rows.slice(1)
        .filter(row => row.trim() !== '')
        .map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {} as any);
        });
      
      return this.parseData(jsonData);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
      throw error;
    }
  }

  async fetchTxtData(isServer: boolean): Promise<T[]> {
    const url = this.getUrl(isServer);
    try {
      const response = await fetch(url, {
        cache: 'no-store'
      });
      
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
              if (key && value) {
                obj[key] = value;
              }
              return obj;
            }, {} as any);
          }
        });
      
      return this.parseData(jsonData);
    } catch (error) {
      console.error("Error fetching TXT data:", error);
      throw error;
    }
  }

  // async fetchApiData(isServer: boolean): Promise<T[]> {
  //   // For external API calls (like RapidAPI or MockAPI)
  //   const url = this.options.endpoint || '';
    
  //   try {
  //     let headers = {};
      
  //     // Only add API keys if they're defined
  //     if (process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST) {
  //       headers = {
  //         'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  //         'x-rapidapi-host': process.env.RAPIDAPI_HOST
  //       };
  //     }
      
  //     const response = await fetch(url, {
  //       headers,
  //       cache: 'no-store'
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch API data: ${response.statusText}`);
  //     }
      
  //     const data = await response.json();
  //     return this.parseData(data);
  //   } catch (error) {
  //     console.error("Error fetching API data:", error);
  //     throw error;
  //   }
  // }
  // This is just the fetchApiData method from the BaseFetcher class
async fetchApiData(isServer: boolean): Promise<T[]> {
  // For external API calls (like RapidAPI or MockAPI)
  const url = this.options.endpoint || '';
  
  if (!url || url === '') {
    console.warn(`No endpoint provided for API data source in component ${this.options.componentId}`);
    return [];
  }
  
  try {
    let headers: Record<string, string> = {};
    
    // Only add API keys if they're defined
    if (process.env.NEXT_PUBLIC_RAPIDAPI_KEY && process.env.NEXT_PUBLIC_RAPIDAPI_HOST) {
      headers = {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST
      };
    }
    
    const response = await fetch(url, {
      headers,
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch API data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.parseData(data);
  } catch (error) {
    console.error(`Error fetching API data from ${url}:`, error);
    // Return empty array instead of throwing to prevent component crashes
    return [];
  }
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