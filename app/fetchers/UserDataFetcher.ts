// 2. Specific Fetcher Implementations

import { BaseFetcher, DataSourceType } from "./BaseFetcher";

// fetchers/UserDataFetcher.ts
export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export class UserDataFetcher extends BaseFetcher<User> {
    constructor(dataSource: DataSourceType = 'json') {
      super({
        componentId: 'UserData',
        dataSource,
        endpoint: dataSource === 'api' ? 'https://api.example.com/users' : undefined
      });
    }
  
    parseData(data: any): User[] {
      // Handle different data structures based on source
      if (Array.isArray(data)) {
        return data.map(user => ({
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || 'No email'
        }));
      }
      
      if (data.users && Array.isArray(data.users)) {
        return data.users.map((user: any) => ({
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || 'No email'
        }));
      }
      
      return [];
    }
  }
  