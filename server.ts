import { serve } from 'bun';
import { readFileSync } from 'fs';
import { join } from 'path';

const PORT = 3000;

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle favicon requests
    if (url.pathname === '/favicon.ico') {
      try {
        const favicon = Bun.file('./public/favicon.ico');
        if (await favicon.exists()) {
          return new Response(favicon);
        }
      } catch {
        // Favicon not found
      }
      return new Response(null, { status: 204 });
    }

    // Serve the root HTML file
    if (url.pathname === '/') {
      const html = readFileSync('./public/index.html', 'utf-8');
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Transpile TypeScript/JSX files
    if (url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts')) {
      try {
        const filePath = join('.', url.pathname);
        const transpiled = await Bun.build({
          entrypoints: [filePath],
          target: 'browser',
          format: 'esm',
        });

        const firstOutput = transpiled.outputs[0];
        if (firstOutput) {
          const output = await firstOutput.text();
          return new Response(output, {
            headers: { 'Content-Type': 'application/javascript' },
          });
        }
      } catch (error) {
        console.error('Error transpiling:', error);
        return new Response(`Error: ${error}`, { status: 500 });
      }
    }

    // Serve static files
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

