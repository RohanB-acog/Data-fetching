// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js Data Fetching System</title>
        <meta name="description" content="Advanced data fetching system in Next.js" />
        <style>
          {`
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            
            h1 {
              margin-bottom: 20px;
              text-align: center;
            }
            
            h2 {
              margin-bottom: 16px;
              border-bottom: 1px solid #eaeaea;
              padding-bottom: 8px;
            }
            
            .container {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            
            .toggle-container {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 16px;
              background-color: #f5f5f5;
              border-radius: 8px;
            }
            
            .mode-toggle, .data-source-toggle {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .toggle-buttons {
              display: flex;
              gap: 8px;
            }
            
            button, select {
              padding: 8px 16px;
              background-color: white;
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            
            button.active {
              background-color: #0070f3;
              color: white;
              border-color: #0070f3;
            }
            
            .content {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
            }
            
            .list-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            
            .list {
              list-style: none;
              display: grid;
              gap: 16px;
            }
            
            .list-item {
              border: 1px solid #eaeaea;
              border-radius: 8px;
              padding: 16px;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .list-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .user-card h3, .product-card h3 {
              margin-bottom: 8px;
              color: #0070f3;
            }
            
            .user-card p, .product-card p {
              margin-bottom: 4px;
              color: #666;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}