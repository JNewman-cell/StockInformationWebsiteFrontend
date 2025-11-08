import { serve } from 'bun';
import { readFileSync } from 'fs';
import { join } from 'path';

const server = serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Serve the HTML file for the root path
    if (url.pathname === '/') {
      const html = readFileSync('./public/index.html', 'utf-8');
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle TypeScript/JSX files - transpile them
    if (url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts')) {
      try {
        const filePath = join('.', url.pathname);
        const file = Bun.file(filePath);
        const transpiled = await Bun.build({
          entrypoints: [filePath],
          target: 'browser',
          format: 'esm',
        });
        
        if (transpiled.outputs.length > 0) {
          const output = await transpiled.outputs[0].text();
          return new Response(output, {
            headers: { 'Content-Type': 'application/javascript' }
          });
        }
      } catch (error) {
        console.error('Error transpiling:', error);
        return new Response(`Error: ${error}`, { status: 500 });
      }
    }
    
    // Serve other static files
    try {
      const filePath = join('.', url.pathname);
      const file = Bun.file(filePath);
      return new Response(file);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
});

console.log(`Server running at http://localhost:${server.port}`);

