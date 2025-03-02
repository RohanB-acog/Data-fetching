// app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DataSourceType } from '../../fetchers/BaseFetcher';
import fs from 'fs';
import path from 'path';

// Helper function that reads data from files (server-side only)
async function fetchDataFromFile(componentId: string, dataSource: DataSourceType = 'json'): Promise<any[] | string> {
  const extension = dataSource === 'json' ? 'json' : 
                   dataSource === 'csv' ? 'csv' : 
                   dataSource === 'txt' ? 'txt' : 'json';
                   
  const fileName = componentId.replace('Data', '').toLowerCase();
  
  try {
    // Path to the data file
    const filePath = path.join(process.cwd(), 'app', 'data', `${fileName}s.${extension}`);
    
    // Read file based on type
    if (dataSource === 'json') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else if (dataSource === 'csv' || dataSource === 'txt') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent; // Return raw content as string
    }
    
    return [];
  } catch (error) {
    console.error(`Error reading ${extension} file for ${componentId}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const component = searchParams.get('component');
  const dataSource = (searchParams.get('dataSource') || 'json') as DataSourceType;
  
  if (!component) {
    return NextResponse.json({ error: 'Component parameter is required' }, { status: 400 });
  }
  
  try {
    // Now fetchDataFromFile is directly called from the API route
    const data = await fetchDataFromFile(component, dataSource);
    
    // Return appropriate response based on data source
    if (dataSource === 'json') {
      return NextResponse.json(data);
    } else if (dataSource === 'csv' || dataSource === 'txt') {
      return new NextResponse(data as string, {
        headers: {
          'Content-Type': dataSource === 'csv' ? 'text/csv' : 'text/plain',
        },
      });
    }
    
    return NextResponse.json({ error: 'Unsupported data source' }, { status: 400 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}