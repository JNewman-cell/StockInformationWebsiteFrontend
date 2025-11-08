import { serve } from 'bun';

serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    
    // Serve the HTML file for the root path
    if (url.pathname === '/') {
      return new Response(Bun.file('./public/index.html'));
    }
    
    // Serve static files from public directory
    if (url.pathname.startsWith('/public/')) {
      return new Response(Bun.file('.' + url.pathname));
    }
    
    // Serve source files
    if (url.pathname.startsWith('/src/')) {
      return new Response(Bun.file('.' + url.pathname));
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log('Server running at http://localhost:3000');
