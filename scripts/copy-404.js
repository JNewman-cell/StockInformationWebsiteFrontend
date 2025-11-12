import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

// Copy dist/index.html to dist/404.html for GitHub Pages SPA fallback.
const distDir = join(process.cwd(), 'dist');
const indexPath = join(distDir, 'index.html');
const notFoundPath = join(distDir, '404.html');

if (!existsSync(indexPath)) {
  console.error('build output not found at', indexPath);
  process.exit(1);
}

try {
  copyFileSync(indexPath, notFoundPath);
  console.log('Copied index.html to 404.html');
} catch (err) {
  console.error('Failed to copy index.html to 404.html', err);
  process.exit(1);
}
