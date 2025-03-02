// fetchers/UserDataFetcher.ts
import { BaseFetcher, DataSourceType } from "./BaseFetcher";

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
      endpoint: dataSource === 'api' ? 'https://67c43235c4649b9551b2e5e1.mockapi.io/api/users/users' : undefined
    });
  }

  parseData(data: any): User[] {
    // Handle different data structures based on source
    if (Array.isArray(data)) {
      return data.map(user => ({
        id: typeof user.id === 'number' ? user.id : parseInt(user.id) || 0,
        name: user.name || 'Unknown',
        email: user.email || 'No email'
      }));
    }
    
    if (data.users && Array.isArray(data.users)) {
      return data.users.map((user: any) => ({
        id: typeof user.id === 'number' ? user.id : parseInt(user.id) || 0,
        name: user.name || 'Unknown',
        email: user.email || 'No email'
      }));
    }
    
    return [];
  }
}